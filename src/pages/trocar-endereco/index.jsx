import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Endereco from "../../components/endereco/lista";
import api from '../../services/api';

function TrocarEndereco(){

    const navigate = useNavigate();
    const [enderecos, setEnderecos] = useState([]);
    
    useEffect(() => {
        api.get('/v1/usuarios/enderecos')
        .then(response => setEnderecos(response.data))
        .catch(err => console.log(err));
    }, []);

    function TrocarEndereco(endereco){
        localStorage.setItem('sessionCidade', endereco.cidade);
        localStorage.setItem('sessionUF', endereco.uf);
        localStorage.setItem('sessionCodCidade', endereco.cod_cidade);
        navigate('/');
    }

    return <div className="container-fluid mt-page">
        <Navbar />
        
        <div className="row col-lg-6 offset-lg-3">

            <div className="col-12 mt-4 d-flex justify-content-between">
                <h2 className="mt-2">Selecione seu endereço</h2>                
            </div>

            <div className="row mt-5">
                {
                    enderecos.map(endereco => {
                        return <Endereco key={endereco.id_endereco}
                                         id_endereco={endereco.id_endereco}
                                         endereco={endereco.endereco}
                                         complemento={endereco.complemento}
                                         bairro={endereco.bairro}
                                         cidade={endereco.cidade}
                                         uf={endereco.uf}
                                         cod_cidade={endereco.cod_cidade}
                                         cep={endereco.cep}
                                         ind_padrao={endereco.ind_padrao}
                                         onClickTrocarEndereco={TrocarEndereco}
                                          />
                    })
                }
            </div>

        </div>
    </div>
}

export default TrocarEndereco;