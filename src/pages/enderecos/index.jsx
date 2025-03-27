import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Endereco from "../../components/endereco/lista";
import api from '../../services/api';
import EnderecoModal from "../../components/endereco/modal";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Enderecos(){

    const [enderecos, setEnderecos] = useState([]);
    const [isEnderecoOpen, setIsEnderecoOpen] = useState(false);
    const [dadosEndereco, setDadosEndereco] = useState([]);

    function ListarEnderecos(){
        api.get('/v1/usuarios/enderecos')
        .then(response => setEnderecos(response.data))
        .catch(err => console.log(err));
    }

    function openModalEndereco(id){

        //console.log(id);

        if (id > 0) {
            api.get(`v1/usuarios/enderecos/${id}`)
            .then(response => {
                setDadosEndereco(response.data[0]);
                setIsEnderecoOpen(true);
            })
            .catch(err => console.log(err));
        } else {
            setDadosEndereco([]);
            setIsEnderecoOpen(true);
        }
        
    }

    function closeModalEndereco(){
        setIsEnderecoOpen(false);
        ListarEnderecos();
    }

    function ExcluirEndereco(id){

        confirmAlert({
            title: 'Exclusão',
            message: 'Confirma a exclusão do endereço?',
            buttons: [
              {
                label: 'Sim',
                onClick: () => {
                    api.delete(`v1/usuarios/enderecos/${id}`)
                    .then(response => ListarEnderecos())
                    .catch(err => console.log(err));
                }
              },
              {
                label: 'Não',
                onClick: () => {}
              }
            ]
          });
        
    }

    function EnderecoPadrao(id){
        api.patch(`v1/usuarios/enderecos/padrao/${id}`)
            .then(response => ListarEnderecos())
            .catch(err => console.log(err));
    }
 
    useEffect(() => ListarEnderecos(), []);

    return <div className="container-fluid mt-page">
        <Navbar />

        <EnderecoModal isOpen={isEnderecoOpen} 
                       onRequestClose={closeModalEndereco}
                       dados_endereco={dadosEndereco} />

        <div className="row col-lg-6 offset-lg-3">

            <div className="col-12 mt-4 d-flex justify-content-between">
                <h2 className="mt-2">Meus Endereços</h2>
                <button onClick={(e) => openModalEndereco(0)} className="btn btn-sm btn-outline-danger">Adicionar endereço</button>
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
                                         cep={endereco.cep}
                                         ind_padrao={endereco.ind_padrao}
                                         onClickEditEndereco={openModalEndereco}
                                         onClickDeleteEndereco={ExcluirEndereco}
                                         onClickEnderecoPadrao={EnderecoPadrao} />
                    })
                }
            </div>

        </div>
    </div>
}

export default Enderecos;