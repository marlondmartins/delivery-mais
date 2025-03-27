import { useEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import closeIcone from '../../../assets/close.png';
import './style.css';
import api from '../../../services/api';

Modal.setAppElement('#root');

function EnderecoModal(props){

    const [id_endereco, setId_Endereco] = useState(0);
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidades, setCidades] = useState([]);
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [cep, setCEP] = useState('');
    const [codCidade, setCodCidade] = useState('');
    const [ind_padrao, setInd_padrao] = useState('');
    const [mensagem, setMensagem] = useState('');

    function SalvarCidade(e){
        const [cid, est] = e.target[e.target.selectedIndex].text.split(" - ");
        setCidade(cid);
        setUF(est);
        setCodCidade(e.target.value);        
    }

    function SalvarEndereco(){

        setMensagem('');

        if (id_endereco > 0) {
            api.patch(`v1/usuarios/enderecos/${id_endereco}`, {
                endereco,
                complemento,
                bairro,
                cidade,
                uf,
                cep,
                ind_padrao,
                cod_cidade: codCidade
            })
            .then(response => props.onRequestClose())
            .catch(err => {
                if (err.response){
                    setMensagem(err.response.data.erro);
                } else {
                    setMensagem('Ocorreu um erro na requisição');
                }
            });
        } else {
            api.post(`v1/usuarios/enderecos`, {
                endereco,
                complemento,
                bairro,
                cidade,
                uf,
                cep,
                ind_padrao,
                cod_cidade: codCidade
            })
            .then(response => props.onRequestClose())
            .catch(err => {
                if (err.response){
                    setMensagem(err.response.data.erro);
                } else {
                    setMensagem('Ocorreu um erro na requisição');
                }
            });
        }
    }

    useEffect(() => {
        setId_Endereco(props.dados_endereco.id_endereco);
        setEndereco(props.dados_endereco.endereco);
        setComplemento(props.dados_endereco.complemento);
        setBairro(props.dados_endereco.bairro);
        setCidade(props.dados_endereco.cidade);
        setUF(props.dados_endereco.uf);
        setCEP(props.dados_endereco.cep);
        setInd_padrao('N');
        setCodCidade(props.dados_endereco.cod_cidade);
        
        api.get('v1/cidades')
        .then(response => setCidades(response.data))
        .catch(err => console.log(err));

    }, [props.isOpen]);    


    return <Modal isOpen={props.isOpen}
                  onRequestClose={props.onRequestClose}
                  overlayClassName="react-modal-overlay"
                  className="react-modal-content">
            
            <button type="button" onClick={props.onRequestClose} className="react-modal-close">
                <img src={closeIcone} alt="Fechar" />
            </button>

            <div className="container-fluid h-100 endereco">
                <div className="col-12 mt-4">
                    <h4 className="mt-2 mb-4">Editar Endereço</h4>

                    <form>
                        <div className="row">
                            <div className="mb-3 col-8 d-inline-block">
                                <label htmlFor="InputNome" className="form-label mb-1">Endereço</label>
                                <input type="text" onChange={(e) => setEndereco(e.target.value)} value={endereco} className="form-control mb-2" id="InputNome" aria-describedby="nome" />                    
                            </div>
                            <div className="mb-3 col-4 d-inline-block">
                                <label htmlFor="InputNome" className="form-label mb-1">Compl.</label>
                                <input type="text" onChange={(e) => setComplemento(e.target.value)} value={complemento} className="form-control mb-2" placeholder="Ex: Ap 62" id="InputNome" aria-describedby="nome" />                    
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-12">
                                <label htmlFor="InputNome" className="form-label mb-1">Bairro</label>
                                <input type="text" onChange={(e) => setBairro(e.target.value)} value={bairro} className="form-control mb-2" id="InputNome" aria-describedby="nome" />                    
                            </div>                                
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <label htmlFor="InputNome" className="form-label mb-1">Cidade</label>
                                <div className="form-control mb-3">
                                    <select name="cidades" id="cidades" onChange={SalvarCidade} value={codCidade}>
                                        <option value="0000000">Escolha a cidade</option>

                                        {cidades.map(c => {
                                            return <option value={c.cod_cidade} key={c.cod_cidade}>{c.cidade} - {c.uf}</option>
                                        })}
                                                                                                                        
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-12">
                                <label htmlFor="InputNome" className="form-label mb-1">CEP</label>
                                <input type="text" onChange={(e) => setCEP(e.target.value)} value={cep} className="form-control" id="InputNome" aria-describedby="nome" />                    
                            </div>                                
                        </div>
                    </form>

                </div>

                <div className="row mb-3">
                    <div className="col-12 mt-3 d-flex justify-content-end align-items-center">                       
                        <button onClick={SalvarEndereco} type="button mt-3" className="btn btn-lg btn-danger">Salvar Dados</button>
                    </div>
                </div>

                {mensagem.length > 0 ? <div className="alert alert-danger mt-2 text-center">{mensagem}</div> : null}

            </div>

    </Modal>
}

export default EnderecoModal;