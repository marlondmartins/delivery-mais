import { useContext, useEffect, useState } from "react";
import Modal from 'react-modal/lib/components/Modal';
import closeIcone from '../../../assets/close.png';
import ProdutoItemCheckbox from "../produto-item-checkbox";
import ProdutoItemRadio from "../produto-item-radio";
import api from '../../../services/api';
import './style.css';
import { CartContext } from "../../../contexts/cart";
import {v4 as uuidv4} from 'uuid';

function ProdutoModal(props){
    
    const {cart, AddItemCart} = useContext(CartContext);

    const [id_produto, setId_produto] = useState(0);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [vl_produto, setVl_produto] = useState(0);
    const [vl_promocao, setVl_promocao] = useState(0);
    const [url_foto, setUrl_foto] = useState('');
    const [qtd, setQtd] = useState(1);

    const [opcoes, setOpcoes] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [bloquearBtn, setBloquearBtn] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        if (props.id_produto <= 0){
            return;
        }

        api.get(`v1/produtos/${props.id_produto}`)
        .then(response => {
            setId_produto(props.id_produto);
            setNome(response.data[0].nome);
            setDescricao(response.data[0].descricao);
            setVl_produto(response.data[0].vl_produto);
            setVl_promocao(response.data[0].vl_promocao);
            setUrl_foto(response.data[0].url_foto);
            setQtd(1);
            setTotal(response.data[0].vl_promocao > 0 ? response.data[0].vl_promocao : response.data[0].vl_produto);
        })
        .catch(err => console.log(err));

        api.get(`v1/cardapios/opcoes/${props.id_produto}`)
        .then(response => {
            setOpcoes(response.data);

            let gruposUnico = response.data.map(g => {
                return {
                    id_opcao: g.id_opcao,
                    id_produto: g.id_produto,
                    descricao: g.descricao,
                    ind_obrigatorio: g.ind_obrigatorio,
                    qtd_max_escolha: g.qtd_max_escolha,
                    ind_ativo: g.ind_ativo,
                    ordem: g.ordem,
                    selecao: [] 
                };
            });

            gruposUnico = gruposUnico.filter((item, index, arr) => {
                return arr.findIndex((t) => {
                    return t.id_opcao === item.id_opcao;
                }) === index;
            });
                        
            setGrupos(gruposUnico);            
            HabilitaBotao(gruposUnico);
        })
        .catch(err => console.log(err));

    }, [props.isOpen]);

    function ClickMais(){
        setQtd(qtd + 1);
    }

    function ClickMenos(){
        qtd > 1 ? setQtd(qtd - 1) : setQtd(1);
    }

    function AddItem(){
        let detalhes = [];
        let vl_detalhes = 0;

        grupos.map(item => {
            item.selecao.map(sel => {
                vl_detalhes += sel.vl_item;

                detalhes.push({
                    nome: sel.nome,
                    id_item: sel.id_item,
                    vl_item: sel.vl_item,
                    ordem: sel.ordem
                });
            });
        });



        const item = {
            id_carrinho: uuidv4(),
            id_produto: id_produto,
            nome: nome,
            descricao: nome,
            qtd: qtd,
            vl_unit: vl_detalhes + (vl_promocao > 0 ? vl_promocao : vl_produto),
            vl_total: (vl_detalhes + (vl_promocao > 0 ? vl_promocao : vl_produto)) * qtd,
            url_foto: url_foto,
            detalhes: detalhes
        };

        console.log(item);

        AddItemCart(item);
        props.onRequestClose();
    }

    function SelecionaRadioButton(op){        
        let g = grupos;

        // Descobrir o indice do grupo clicado...
       let objIndex = g.findIndex(obj => obj.id_opcao == op.id_opcao); 

       // Atualizar informacao do item naquele indice...
       g[objIndex].selecao = [op];

       setGrupos(g);
       HabilitaBotao(g);
       CalculaTotal(g);
    }

    function SelecionaCheckbox(isChecked, op){
        let g = grupos;
        let s = [];

        // Descobrir o indice do grupo clicado...
       let objIndex = g.findIndex(obj => obj.id_opcao == op.id_opcao);

       // Extrai os itens selecionados...
       s = g[objIndex].selecao;
              
       // Verfificar se deve inserir ou remover um item...
       if (isChecked){
           s.push(op);
       } else {
           let objIndexSel = s.findIndex(obj => obj.id_item == op.id_item);
           s.splice(objIndexSel, 1);
       }

       g[objIndex].selecao = s;
       setGrupos(g);
       HabilitaBotao(g);
       CalculaTotal(g);
    }
   
    function HabilitaBotao(grp){
        let bloquear = false;
        
        grp.map(item => {
            if (item.ind_obrigatorio == "S" && item.selecao.length == 0){
                bloquear = true;
            }
        });

        setBloquearBtn(bloquear);
    }

    function CalculaTotal(grp){
        let vl_selecao = 0;
        let vl_prod = vl_promocao > 0 ? vl_promocao : vl_produto;

        grp.map(item => {
            item.selecao.map(sel => {
                //vl_selecao = vl_selecao + sel.vl_item;
                vl_selecao += sel.vl_item;
            });
        });

        setTotal((vl_selecao + vl_prod) * qtd);
    }

    useEffect(() => {
        CalculaTotal(grupos);
    }, [qtd]);

    return <Modal isOpen={props.isOpen}
                  onRequestClose={props.onRequestClose}
                  overlayClassName="react-modal-overlay"
                  className="react-modal-content">
        
        <button type="button" onClick={props.onRequestClose} className="react-modal-close">
            <img src={closeIcone} alt="Fechar" />
        </button>

        <div className="container-fluid h-100 produto-modal">
            <div className="row detalhes-produto">
                <div>
                    <img className="img-fluid rounded img-produto-modal" 
                         src={url_foto}
                         alt="Produto" />
                </div>

                <div className="col-12 mt-4">
                    <h4 className="mt-2">{nome}</h4>
                    <small className="d-block mb-3">
                        {descricao}
                    </small>

                    {
                        vl_promocao > 0 ? <>
                        <small className="mt-3 promocao">
                        {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(vl_promocao)}
                        </small>
                        <small className="ms-4 mt-3 preco-antigo">
                        {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(vl_produto)}
                        </small></>
                        :
                        <small className="mt-3">
                        {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(vl_produto)}
                        </small>
                    }
                </div>

                <div className="col-12 mb-4">
                    {
                        grupos.map(grupo => {

                            let op = opcoes.filter((item, index, arr) => {
                                return item.id_opcao == grupo.id_opcao
                            });

                            return grupo.qtd_max_escolha == 1 ?
                                    <ProdutoItemRadio key={grupo.id_opcao}
                                                      titulo={grupo.descricao}
                                                      obrigatorio={grupo.ind_obrigatorio == "S" ? true : false}
                                                      opcoes={op}
                                                      onClickItem={SelecionaRadioButton}
                                                      />
                                 :
                                 <ProdutoItemCheckbox key={grupo.id_opcao}
                                                      titulo={grupo.descricao}
                                                      opcoes={op}
                                                      onClickItem={SelecionaCheckbox}
                                                       />
                        })
                                                            
                    }
                </div>
            </div>

            <div className="row">
                <div className="col-12 mt-3 d-flex justify-content-end">
                    <div>                    
                        <button onClick={ClickMenos} className="btn btn-outline-danger"><i className="fas fa-minus"></i></button>
                        <span className="m-3 button-qtd">{qtd.toLocaleString('pt-BR', {
                            minimumIntegerDigits: 2
                        })}</span>
                        <button onClick={ClickMais} className="btn btn-outline-danger"><i className="fas fa-plus"></i></button>

                        <button onClick={AddItem} className="btn btn-danger ms-4" disabled={bloquearBtn}>Adicionar a sacola (
                            {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(total)}
                        )</button>
                    </div>
                </div>
            </div>
        </div>

    </Modal>
}

export default ProdutoModal;