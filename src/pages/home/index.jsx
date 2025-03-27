import { useEffect, useState } from "react";
import Navbar from '../../components/navbar';
import Categoria from "../../components/categoria";
import Banner from "../../components/banner";
import Estabelecimento from "../../components/estabelecimento";
import Footer from "../../components/footer";
import api from '../../services/api';

function Home(){

    const [categorias, setCategorias] = useState([]);
    const [banners, setBanners] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [destaques, setDestaques] = useState([]);    
    
    useEffect(() => {
        api.get('v1/categorias?cod_cidade=' + localStorage.getItem('sessionCodCidade'))
        .then(response => {
            setCategorias(response.data);
        })
        .catch(err => {
            console.log(err);
        });

        api.get('v1/banners?cod_cidade=' + localStorage.getItem('sessionCodCidade'))
        .then(response => {
            setBanners(response.data);
        })
        .catch(err => {
            console.log(err);
        });

        api.get('v1/destaques?cod_cidade=' + localStorage.getItem('sessionCodCidade'))
        .then(response => {

            // ["Pra Você", "Pra Você", "Pra Você", "Entrega Grátis", "Entrega Grátis"]
            // ["Pra Você", "Entrega Grátis"]

            /*
            [ 
                "Destaques: Pra Você",     0
                "Destaques: Pra Você",     1
                "Destaques: Pra Você",     2
                "Entrega Grátis",          3
                "Entrega Grátis"           4
            ]
            */

            let gruposUnico = response.data.map(grupo => grupo.descricao);

            gruposUnico = gruposUnico.filter((itemArray, i, arrayCompleto) => {
                return arrayCompleto.indexOf(itemArray) === i;
            });
                 
            setGrupos(gruposUnico);
            setDestaques(response.data);
            
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    return <>
        <div className="container-fluid mt-page">
            <Navbar />

            <div className="row justify-content-center text-center">                
                {                    
                    categorias.map(categoria => {
                        return <Categoria key={categoria.id_categoria} 
                                url_imagem={categoria.foto}
                                descricao={categoria.categoria}
                                id_categoria={categoria.id_categoria} />
                    })
                }
            </div>

            <div className="row justify-content-center text-center mt-5 m-2">
                {
                    banners.map(banner => {
                        return <Banner key={banner.id_banner} 
                                       url_imagem={banner.foto}
                                       descricao={banner.descricao}
                                       id_banner={banner.id_banner} />
                    })
                }
            </div>

            {
                grupos.map(grupo => {
                    return <div key={grupo} className="row mt-5 m-2">
                        <h4>{grupo}</h4>
                        
                    {
                        destaques.map(destaque => {
                           return destaque.descricao === grupo ?
                                <Estabelecimento 
                                    key={destaque.id_estabelecimento}
                                    url_imagem={destaque.url_logo}
                                    nome ={destaque.nome}
                                    avaliacao={destaque.avaliacao}
                                    categoria={destaque.categoria}
                                    id_estabelecimento={destaque.id_estabelecimento} /> : null
                        })
                    }

                </div>

                })
            }

            <Footer />

        </div>
        
    </>
    
}

export default Home;