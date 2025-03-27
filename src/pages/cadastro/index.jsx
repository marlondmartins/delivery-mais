import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../../assets/logo-pb.png';
import Fundo from '../../assets/fundo-login.jpg';
import './style.css';
import api from '../../services/api';
import SaltPassword from '../../services/md5';


function Cadastro(){

    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senha2, setSenha2] = useState('');
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');    
    const [codCidade, setCodCidade] = useState('');
    const [cep, setCep] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [cidades, setCidades] = useState([]);

    function SalvarCidade(e){
        const [cid, est] = e.target[e.target.selectedIndex].text.split(" - ");
        setCidade(cid);
        setUF(est);
        setCodCidade(e.target.value);        
    }

    function ProcessaCadastro(e){
        e.preventDefault();
        setMensagem('');

        if (senha != senha2) {
            setMensagem('As senhas não conferem. Digite novamente.');
            return;
        }

        setLoading(true);

        api.post('v1/usuarios/registro', {
            nome,
            email,
            senha: senha.length > 0 ? SaltPassword(senha) : '',
            endereco,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
            cod_cidade: codCidade
        })
        .then(response => {
            if (response.status === 201) {
                localStorage.setItem('sessionToken', response.data.token);
                localStorage.setItem('sessionId', response.data.id_usuario);
                localStorage.setItem('sessionEmail', email);
                localStorage.setItem('sessionCodCidade', codCidade);
                localStorage.setItem('sessionCidade', cidade);
                localStorage.setItem('sessionUF', uf);
                navigate('/');
            } else {
                setLoading(false);
                setMensagem('Ocorreu um erro no cadastro: ' + response.status);
            }
        })
        .catch(err => {
            if (err.response) {
                setMensagem(err.response.data.erro);
            } else {
                setMensagem('Ocorreu um erro na requisição.');
            }
            setLoading(false);
            
        });
    }

    useEffect(() => {
        api.get('v1/cidades')
        .then(response => {
            setCidades(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    return <div className="row">
        <div className="col-sm-6 d-flex justify-content-center align-items-center text-center">
            <form className="form-cadastro mt-5">
                <h3 className="mb-4">Crie sua conta e faça seu pedido.</h3>
                <h6 className="mb-3">Informe os dados abaixo</h6>

                <div className="form-floating">
                    <input type="text" onChange={(e) => setNome(e.target.value)} className="form-control" id="floatingInput" placeholder="Nome completo" />
                    <label htmlFor="floatingInput">Nome completo</label>
                </div>

                <div className="form-floating">
                    <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" id="floatingInput" placeholder="E-mail" />
                    <label htmlFor="floatingInput">E-mail</label>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-floating">
                            <input type="password" onChange={(e) => setSenha(e.target.value)} className="form-control" id="floatingInput" placeholder="Senha" />
                            <label htmlFor="floatingInput">Senha</label>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="form-floating">
                            <input type="password" onChange={(e) => setSenha2(e.target.value)} className="form-control" id="floatingInput" placeholder="Confirme a senha" />
                            <label htmlFor="floatingInput">Confirme a senha</label>
                        </div>
                    </div>
                </div>                

                <div className="row">
                    <div className="col-lg-8">
                        <div className="form-floating">
                            <input type="text" onChange={(e) => setEndereco(e.target.value)} className="form-control" id="floatingInput" placeholder="Endereço" />
                            <label htmlFor="floatingInput">Endereço</label>
                        </div>
                    </div>
                    
                    <div className="col-lg-4">
                        <div className="form-floating">
                            <input type="text" onChange={(e) => setComplemento(e.target.value)} className="form-control" id="floatingInput" placeholder="Compl." />
                            <label htmlFor="floatingInput">Compl.</label>
                        </div>
                    </div>
                </div>     

                <div className="row">
                    <div className="col-lg-6">
                        <div className="form-floating">
                            <input type="text" onChange={(e) => setBairro(e.target.value)} className="form-control" id="floatingInput" placeholder="Bairro" />
                            <label htmlFor="floatingInput">Bairro</label>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="form-control mb-2">
                            <select name="cidades" id="cidades" onChange={SalvarCidade}>
                                <option value="0000000">Cidade</option>

                                {
                                    cidades.map(c => {
                                        return <option key={c.cod_cidade} value={c.cod_cidade}>{c.cidade} - {c.uf}</option>
                                    })
                                }
                                                               
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-floating">
                    <input type="text" onChange={(e) => setCep(e.target.value)} className="form-control mb-2" id="floatingInput" placeholder="CEP" />
                    <label htmlFor="floatingInput">CEP</label>
                </div>

                <button onClick={ProcessaCadastro} className="w-100 btn btn-lg btn-danger" disabled={loading}>
                    {loading ? <div>
                                <span className="spinner-border spinner-border-sm text-light" role="status"></span>
                                <span className="ms-2">Enviando...</span>
                                </div> : <span className="ms-2">Criar conta</span>
                    }
                </button>

                {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}

                <div className="mt-5">
                    <Link to="/login">Já tenho uma conta. Fazer login!</Link>
                </div>

                <img src={Logo} alt="Delivery Mais" className="mt-5"/>
            </form>    
        </div>

        <div className="col-sm-6 px-0 d-none d-sm-block">
            <img className="background-cadastro" src={Fundo} alt="Delivery Mais" />
        </div>
    </div>
}

export default Cadastro;