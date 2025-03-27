import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from '../../contexts/cart';
import Navbar from '../../components/navbar';
import Produto from '../../components/produto/sacola';
import api from '../../services/api';


function Checkout(){

    const navigate = useNavigate();
    const {cart, subtotalCart, descontoCart, cupomCart, entregaCart, totalCart, idEstabelecimentoCart,
           idCupomCart, setCart, setIdCupomCart} = useContext(CartContext);
    const [enderecos, setEnderecos] = useState([]);

    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');    
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [cep, setCEP] = useState('');
    const [codCidade, setCodCidade] = useState('');

    useEffect(() => {

        if (cart.length == 0) {
            navigate('/');
            return;
        }

        api.get('v1/usuarios/enderecos', {
            params: {
                cod_cidade: localStorage.getItem('sessionCodCidade')
            }
        })
        .then(response => setEnderecos(response.data))
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (cart.length == 0) {
            navigate('/');    
        }
    }, [cart]);

    function FinalizarPedido(){
        
        api.post('v1/pedidos', {
            id_estabelecimento: idEstabelecimentoCart,
            id_cupom: idCupomCart ?? 0,
            vl_taxa_entrega: entregaCart,
            vl_desconto: descontoCart,
            vl_total: totalCart,
            endereco,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
            cod_cidade: codCidade,
            itens: cart 
        })
        .then(response => {
            if (response.data) {
                sessionStorage.removeItem('sessionCart');
                setCart([]);
                setIdCupomCart(0);
                navigate('/pedidos');            
            } else {
                alert('Erro ao enviar o pedido');
            }
        })
        .catch(err => console.log(err));        
    }

    function SelecionarEndereco(end){
        setEndereco(end.endereco);
        setComplemento(end.complemento);    
        setBairro(end.bairro);
        setCidade(end.cidade);
        setUF(end.uf);
        setCEP(end.cep);
        setCodCidade(end.cod_cidade);        
    }

    return <div className="container-fluid mt-page">
        <Navbar />
    
        <div className="row col-lg-6 offset-lg-3">            
            <div>
                <h2 className="mt-2">Finalizar Pedido</h2>
            </div>

            <div className="row mt-3">
                {
                    cart.map(prod => {
                        return <div key={prod.id_carrinho}>
                                <Produto nome={prod.nome}
                                        valor_total={prod.vl_unit * prod.qtd}
                                        qtd={prod.qtd}
                                        valor_unit={prod.vl_unit}
                                        id_carrinho={prod.id_carrinho}
                                        url_foto={prod.url_foto}
                                        //onClickRemover={RemoveItemCart}
                                        detalhes={prod.detalhes}
                                        />
                            </div>
                    })
                }
            </div>

            <div className="row align-items-end mt-5">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <span>Subtotal</span>                    
                    <span>{new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(subtotalCart)}</span>
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center mt-2">                                       
                    <small>Desconto {descontoCart > 0 ? 
                        <span className="text-success">{`(cupom ${cupomCart})`}</span>
                        : null}
                    </small> 
                    <span>
                    - {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(descontoCart)}
                    </span>                
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center mt-2">
                    <span>Taxa de entrega</span>                    
                    <span>{new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(entregaCart)}</span>
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center mt-3">
                    <b>Total</b>
                    <h3>{new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(totalCart)}</h3>
                </div>                
            </div>
        
            <div className="mt-5 mb-3">
                <h4>Endereço de Entrega</h4>
            </div>

            <div className="row">
                <ul className="list-group list-group-flush">
                    {
                        enderecos.map(endereco => {
                            return <li className="list-group-item p-3" key={endereco.id_endereco}>
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" 
                                            id={`flexRadioDefault${endereco.id_endereco}`}
                                            onClick={(e) => SelecionarEndereco(endereco)}/>
                                    <label className="form-check-label ms-2" htmlFor={`flexRadioDefault${endereco.id_endereco}`}>
                                        <b>{endereco.endereco} {endereco.complemento.length > 0 ? ` - ${endereco.complemento}` : null}</b>
                                        <small className="d-block">{endereco.cidade} - {endereco.uf}</small>
                                    </label>
                            </li>
                        })
                    }
                </ul>
            </div>

            <div className="row mb-5">
                <button onClick={FinalizarPedido} className="btn btn-lg btn-danger mt-4" disabled={endereco.length == 0}>Finalizar Pedido</button>
            </div>

        </div>

        

    </div>
}

export default Checkout;