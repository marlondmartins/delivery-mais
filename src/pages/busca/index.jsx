import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from '../../components/navbar';
import Estabelecimento from '../../components/estabelecimento';
import api from '../../services/api';

function Busca(){
    
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [resultado, setResultado] = useState([]);
    const [mais, setMais] = useState(true);
    const [processando, setProcessando] = useState(false);
    const [pagina, setPagina] = useState(1);    

    var id_categoria = searchParams.get('id_cat');
    var id_banner = searchParams.get('id_banner');
    var descricao = searchParams.get('descr') ?? 'Busca';
    var busca = searchParams.get('q') ?? '';
    var pg = 0;

    function ListarEstabelecimentos(indReset){

        setProcessando(true);        

        pg = indReset ? 1 : pagina + 1;

        api.get('/v1/estabelecimentos', {
            params: {
                cod_cidade: localStorage.getItem('sessionCodCidade'),
                nome: busca,
                id_categoria: id_categoria,
                id_banner: id_banner,
                pagina: pg
            }
        })
        .then( response => {   
            if (indReset) {
                setResultado(response.data);
                setPagina(1);
            } else {
                setResultado((oldArray) => [...oldArray, ...response.data]);
                setPagina(pagina + 1);
            }
            
            setProcessando(false);            
            setMais(response.data.length >= 10);
        })
        .catch(err => {
            console.log(err);
            setProcessando(false);
        });
    }

    useEffect(() => {
        ListarEstabelecimentos(true);
    }, [location]);

    return <div className="container-fluid mt-page">
        <Navbar/>

        <div className="row m-2">
            <h3>{descricao}</h3>
            {busca.length > 0 ? <small className="mb-4 text-secondary">Pesquisando por: {busca}</small> : null}
        </div>

        <div className="row m-2">
            {
                resultado.map(estabelecimento => {
                    return <Estabelecimento 
                            key={estabelecimento.id_estabelecimento}
                            url_imagem={estabelecimento.url_logo}
                            nome ={estabelecimento.nome}
                            avaliacao={estabelecimento.avaliacao}
                            categoria={estabelecimento.categoria}
                            id_estabelecimento={estabelecimento.id_estabelecimento}/> 
                })
            }
        </div>

        {
            processando ? <div className="text-center m-5">
                <span className="spinner-grow spinner-grow-sm text-danger me-2" role="status"></span>
                <span className="text-danger">Buscando restaurantes...</span>
            </div> : null
        }

        { !processando && mais ? <div className="row m-4">
            <button onClick={(e) => ListarEstabelecimentos(false)} className="btn btn-outline-danger">Ver mais restaurantes</button>
            </div> : null
        }

    </div>
}

export default Busca;