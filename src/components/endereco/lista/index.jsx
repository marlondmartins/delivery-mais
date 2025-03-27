function Endereco(props){
    return <div className="col-12 pt-3 pb-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <span className="d-block"><b>{props.endereco} 
                {props.complemento ? ' - ' + props.complemento : null}
                </b></span>
                <small className="d-block">{props.bairro} - {props.cidade} - {props.uf}</small>
                <small className="d-inline-block me-3">CEP: {props.cep}</small>
                {
                    props.ind_padrao === "S" ?
                    <small className="d-inline-block text-danger">Endedeço Principal</small> : null
                }
            </div>            

            <div>
                {props.ind_padrao != 'S' && props.onClickEnderecoPadrao ? 
                <button onClick={(e) => props.onClickEnderecoPadrao(props.id_endereco)} className="btn btn-outline-secondary me-3 m-2">Tornar Padrão</button>
                : null}

                { props.onClickEditEndereco ?
                <button onClick={(e) => props.onClickEditEndereco(props.id_endereco)} className="btn btn-outline-danger me-3 m-2">Editar</button> : null
                }

                { props.onClickDeleteEndereco ?
                <button onClick={(e) => props.onClickDeleteEndereco(props.id_endereco)} className="btn btn-danger m-2">Excluir</button> : null
                }

                { props.onClickTrocarEndereco ?
                <button onClick={(e) => props.onClickTrocarEndereco({cidade: props.cidade, uf: props.uf, cod_cidade: props.cod_cidade})} className="btn btn-outline-danger me-3 m-2">Selecionar</button> : null
                }
            </div>
        </div>
    </div>
}

export default Endereco;