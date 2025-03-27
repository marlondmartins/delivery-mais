import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import api from '../../services/api';

function Perfil(){

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [erro, setErro] = useState('');

    function ExibeMsg(){
        setMsg('Dados alterados com sucesso');
        setTimeout(() => setMsg(''), 3000);
    }

    function ExibeErro(str){
        setErro(str);
        setTimeout(() => setErro(''), 5000);
    }

    function SalvarDados(){
        api.patch('/v1/usuarios', {
            nome,
            email
        })
        .then(response => {
            ExibeMsg();
        })
        .catch(err => {
            if (err.response) {
                ExibeErro(err.response.data.erro);
            } else {
                ExibeErro('Ocorreu um erro na requisição.');
            }
        });
    }

    useEffect(() => {
        api.get(`/v1/usuarios/${localStorage.getItem("sessionId")}`)
        .then(response => {
            setNome(response.data[0].nome);
            setEmail(response.data[0].email);
        })
        .catch(err => console.log(err));
    }, []);

    return <div className="container-fluid mt-page">
        <Navbar />

        <div className="row col-lg-6 offset-lg-3">
        
            <div className="row m-2">
                <h3>Meu Perfil</h3>
            </div>

            <div className="row col-12">
                <div className="row m-2">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="InputNome" className="form-label">Nome</label>
                            <input type="text" onChange={(e) => setNome(e.target.value)} value={nome} className="form-control" id="InputNome" aria-describedby="nome" />                    
                        </div>
                        <div className="mb-5">
                            <label htmlFor="InputEmail" className="form-label">E-mail</label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control" id="InputEmail" aria-describedby="email" />                    
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={SalvarDados} className="btn btn-lg btn-danger">Salvar Dados</button>
                        </div>

                        {
                            msg.length > 0 ? <div className="alert alert-success mt-4 text-center">{msg}</div> : null
                        }

                        {
                            erro.length > 0 ? <div className="alert alert-danger mt-4 text-center">{erro}</div> : null
                        }
                    </form>
                </div>

            </div>
        </div>
    </div>
}

export default Perfil;