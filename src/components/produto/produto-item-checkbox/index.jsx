function ProdutoItemCheckbox(props){
    return <div className="card mt-4">
        <div className="card-header d-flex justify-content-between">
            {props.titulo}

            {
            //props.obrigatorio ? <span className="badge bg-secondary">OBRIGATÓRIO</span> : null
            }
        </div>

        <ul className="list-group list-group-flush">

            { props.opcoes.map(opcao => {
                return <li className="list-group-item d-flex justify-content-between" key={opcao.id_item}>
                <div>
                    <input className="form-check-input" type="checkbox" value="" 
                           id={`flexCheckDefault${opcao.id_item}`} 
                           onClick={(e) => props.onClickItem(e.target.checked, {
                            id_opcao: opcao.id_opcao,
                            nome: opcao.nome_item,
                            id_item: opcao.id_item,
                            vl_item: opcao.vl_item,
                            ordem: opcao.ordem 
                        })}/>
                    <label className="form-check-label ms-2" htmlFor={`flexCheckDefault${opcao.id_item}`}>
                        {opcao.nome_item}
                    </label>
                </div>
                <div>
                    { opcao.vl_item > 0 ?
                        <span className="text-danger">{
                        new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(opcao.vl_item)
                        }</span>
                        : null 
                    }
                </div>
            </li>      
            })

            }
        </ul>

    </div>
}

export default ProdutoItemCheckbox;