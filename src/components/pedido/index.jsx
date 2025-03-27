import AvaliacaoCheia from '../../assets/star.png';
import AvaliacaoVazia from '../../assets/star2.png';
import './style.css';
import api from '../../services/api';
import { useState } from "react";

function Pedido(props){

    const dt_ped = new Date(props.dt_pedido);
    const [avaliar, setAvaliar] = useState(false);
    const [avaliacao, setAvaliacao] = useState(props.avaliacao);

    function Status(st){
        switch (st){
            case "P": return "Pedido em produção";
            case "E": return "Saiu para entrega";
            case "A": return "Aguardando...";
            default: return "";
        }
    }

    function Avaliar(avaliacao){
        api.patch(`/v1/pedidos/avaliacao/${props.id_pedido}`, {
            avaliacao
        })
        .then(response => {
            setAvaliar(false);
            setAvaliacao(avaliacao);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return <div className="border-bottom pt-3 pb-3 d-flex justify-content-between">
        
            <div className="d-flex">
                <div className="me-4 img-pedido">
                    <img className="img-pedido" src={props.url_imagem} alt="Estabelecimento" />
                </div>

                <div className="d-inline-block">
                    <span className="d-block"><b>{props.nome}</b></span>
                    <small className="d-block text-danger">Pedido Nº {props.id_pedido}</small>
                    <small className="d-block">{props.qtd_item} {props.qtd_item > 1 ? 'itens' : 'item'} - 
                                               {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(props.vl_total)} - 
                                               {new Intl.DateTimeFormat('pt-BR').format(dt_ped)}</small>
                    <div>
                        {
                            !['A', 'P', 'E'].includes(props.status) ? <>
                            <img src={avaliacao > 0 ? AvaliacaoCheia : AvaliacaoVazia} alt="Classificação" />
                            <img src={avaliacao > 1 ? AvaliacaoCheia : AvaliacaoVazia} alt="Classificação" />
                            <img src={avaliacao > 2 ? AvaliacaoCheia : AvaliacaoVazia} alt="Classificação" />
                            <img src={avaliacao > 3 ? AvaliacaoCheia : AvaliacaoVazia} alt="Classificação" />
                            <img src={avaliacao > 4 ? AvaliacaoCheia : AvaliacaoVazia} alt="Classificação" /> 
                            </>  : null
                        }
                    </div>

                    <span className="badge bg-secondary text-light">{Status(props.status)}</span>
                </div>
            </div>

            <div className="d-flex align-items-center">
                {
                    !['A', 'P', 'E'].includes(props.status) && !avaliar ?
                    <button onClick={(e) => setAvaliar(true)} className="btn btn-outline-danger">Avaliar</button> : null
                }

                {
                    avaliar ? <div>
                    <img src={AvaliacaoVazia} alt="Classificação" onClick={(e) => Avaliar(1)} className="pedido-avaliar" />
                    <img src={AvaliacaoVazia} alt="Classificação" onClick={(e) => Avaliar(2)} className="pedido-avaliar" />
                    <img src={AvaliacaoVazia} alt="Classificação" onClick={(e) => Avaliar(3)} className="pedido-avaliar" />
                    <img src={AvaliacaoVazia} alt="Classificação" onClick={(e) => Avaliar(4)} className="pedido-avaliar" />
                    <img src={AvaliacaoVazia} alt="Classificação" onClick={(e) => Avaliar(5)} className="pedido-avaliar" /> 
                    </div>  : null
                }
                
            </div>
        
    </div>
}

export default Pedido;