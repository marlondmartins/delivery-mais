import { useParams } from "react-router-dom";

import Navbar from "../../components/navbar";
import './style.css';
import Star from '../../assets/star.png';
import Produto from '../../components/produto/lista';
import Footer from '../../components/footer';
import { useContext, useEffect, useState } from "react";
import api from '../../services/api';
import ProdutoModal from '../../components/produto/modal';
import FavVazio from '../../assets/favorito.png';
import FavCheio from '../../assets/favorito2.png';
import { CartContext } from "../../contexts/cart";



function Cardapio(){

    const {cart, setEntregaCart, idEstabelecimentoCart, setIdEstabelecimentoCart} = useContext(CartContext);

    const {id} = useParams();
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [avaliacao, setAvaliacao] = useState(0);
    const [foto, setFoto] = useState('');
    const [entrega, setEntrega] = useState(0);
    const [minimo, setMinimo] = useState(0);
    const [qtd, setQtd] = useState(0);
    const [favorito, setFavorito] = useState(false);
    const [idFavorito, setIdFavorito] = useState(0);
    const [id_produto, setId_produto] = useState(0);

    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);

    const [isProdutoOpen, setIsProdutoOpen] = useState(false);

    useEffect(() => {
        api.get(`/v1/estabelecimentos/${id}`)
        .then(response => {
            setNome(response.data[0].nome);
            setEndereco(response.data[0].endereco);
            setComplemento(response.data[0].complemento);
            setBairro(response.data[0].bairro);
            setCidade(response.data[0].cidade);
            setUF(response.data[0].uf)
            setAvaliacao(response.data[0].avaliacao);
            setFoto(response.data[0].url_foto);
            setEntrega(response.data[0].vl_taxa_entrega);
            setMinimo(response.data[0].vl_min_pedido);
            setQtd(response.data[0].qtd_avaliacao);
            setFavorito(response.data[0].id_favorito > 0);
            setIdFavorito(response.data[0].id_favorito);
        })
        .catch(err => {
            console.log(err);
        });

        api.get(`/v1/cardapios/${id}`)
        .then(response => {

            let categoriasUnica = response.data.map(item => item.categoria);

            categoriasUnica = categoriasUnica.filter((itemArray, i, arrayCompleto) => {
                return arrayCompleto.indexOf(itemArray) === i;
            });
                 
            setCategorias(categoriasUnica);
            setProdutos(response.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    function openModalProduto(id_prod){

        // Valida se pode abrir o produto (nao pode ter iniciado compra de outro estab)
        if (cart.length > 0 && idEstabelecimentoCart != id && idEstabelecimentoCart > 0) {
            alert('Já existem produtos de outro estabelecimento na sacola.');
            return;
        }

        setId_produto(id_prod);
        setEntregaCart(entrega);
        setIdEstabelecimentoCart(id);
        setIsProdutoOpen(true);
    }

    function closeModalProduto(){
        setIsProdutoOpen(false);
    }

    function Favoritar(){
        api.post('/v1/estabelecimentos/favoritos', {
            id_estabelecimento: id
        })
        .then(response => {
            setFavorito(true);
            setIdFavorito(response.data.id_favorito);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function RemoverFavorito(){
        api.delete(`/v1/estabelecimentos/favoritos/${idFavorito}`)
        .then(response => {
            setFavorito(false);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return <div className="container-fluid mt-page cardapio">
        <Navbar />

        <ProdutoModal isOpen={isProdutoOpen}
                      onRequestClose={closeModalProduto}
                      id_produto={id_produto}/>

        <div className="row col-lg-8 offset-lg-2">
            <div className="col-12">
                <img className="img-fluid rounded img-estab-cardapio" 
                     src={foto}
                     alt="Estabelecimento" />
            </div>

            <div className="col-12 mt-4">
                <div className="d-flex justify-content-between">
                    <h2>{nome}</h2>
                    <div className="favorito">
                        {
                            favorito ? <img src={FavCheio} alt="Remover Favorito" onClick={RemoverFavorito} /> 
                                     : <img src={FavVazio} alt="Favoritar" onClick={Favoritar} />
                        }
                        
                    </div>
                </div>
                
                <div className="classificacao">
                    <span>{endereco} {complemento.length > 0 ? ' - ' + complemento : null} - {bairro} - {cidade} - {uf}</span>
                </div>
                
                <div className="classificacao">
                    <img src={Star} alt="Avaliação" />
                    <span className="ms-1">{avaliacao.toFixed(1)}</span>
                    <span className="ms-3">{qtd} avaliações</span>
                </div>

                <div className="classificacao mt-3">                    
                    <span><b>Taxa de entrega: </b>
                    {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(entrega)}
                    </span>
                    <span className="ms-5"><b>Pedido mínimo: </b>
                    {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(minimo)}
                    </span>
                </div>
            </div>
       


            {
                categorias.map(categoria => {
                    return <div key={categoria} className="row mt-5">
                        <div className="mb-3">
                            <h5>{categoria}</h5>
                        </div>

                        {
                            produtos.map(produto => {
                                return produto.categoria === categoria ?
                                    <Produto key={produto.id_produto}
                                             nome={produto.nome}
                                             descricao={produto.descricao}
                                             vl_produto={produto.vl_produto}
                                             vl_promocao={produto.vl_promocao}
                                             url_foto={produto.url_foto}
                                             id_produto={produto.id_produto}
                                             onClickProduto={openModalProduto}
                                             />
                                : null
                            })
                        }
                    </div>
                })
            }

        </div>

        <Footer />
        
    </div>
}

export default Cardapio;