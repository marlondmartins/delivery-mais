import './style.css';

function Produto(props){
    return <div className="col-sm-6 mb-3 p-4 produto-lista">
        <a onClick={(e) => props.onClickProduto(props.id_produto)}>
            <div className="row p-3 ps-0 border-bottom">

                <div className="col-3">
                    <img className="img-fluid rounded" 
                         alt="Produto" 
                         src ={props.url_foto} />
                </div>

                <div className="col-9">
                    <small className="d-block"><b>{props.nome}</b></small>
                    <small className="d-block">{props.descricao}</small>

                    { props.vl_promocao > 0 ? <>
                    <span className="badge bg-success d-inline-block mt-3">
                        {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(props.vl_promocao)}
                    </span>
                                    
                    <small className="d-inline-block ms-4 mt-3 preco-antigo">
                    {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(props.vl_produto)}
                    </small></> 
                    
                    :                    

                    <small className="d-inline-block mt-3">
                    {new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(props.vl_produto)}
                    </small>
                    }

                </div>

            </div>
        </a>
    </div>
}

export default Produto;