function Produto(props){
    return <div className="col-12">
        <div className="row p-3 ps-0 border-bottom">
            <div className="col-3">
                <img className="img-fluid rounded" 
                     src={props.url_foto} alt="Produto" />
            </div>

            <div className="col-9">
                <div className="d-flex justify-content-between align-items-center">
                    <small>
                        <b>{props.nome}</b>
                    </small>
                    <small>
                        <b>{new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(props.valor_total)}</b>
                    </small>
                </div>

                <small className="d-block mb-2">
                    {props.qtd.toLocaleString('pt-BR', {minimumIntegerDigits: 2})} x {
                    new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(props.valor_unit)}
                </small>

                {
                    props.detalhes ?
                    props.detalhes.map(detalhe => {
                        return <small className="d-block text-secondary">- {detalhe.nome}</small>
                    })
                    : null
                }

                { props.onClickRemover ? 
                    <button onClick={(e) => props.onClickRemover(props.id_carrinho)} className="btn btn-sm btn-outline-danger mt-2">Remover</button>
                : null
                }
            </div>
        </div>
    </div>
}

export default Produto;