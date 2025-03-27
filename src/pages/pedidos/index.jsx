import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Pedido from "../../components/pedido";
import api from '../../services/api';

function Pedidos(){

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        api.get('/v1/pedidos')
        .then(response => {
            setPedidos(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    return <div className="container-fluid mt-page">
        <Navbar />

        <div className="row col-lg-8 offset-lg-2">

            <div className="col-12 mt-4">
                <h2 className="mt-2">Meus Pedidos</h2>
            </div>

            <div className="row mt-5">
                {
                    pedidos.map(pedido => {
                        return <Pedido key={pedido.id_pedido} 
                                url_imagem={pedido.url_logo}
                                avaliacao={pedido.avaliacao}
                                qtd_item={pedido.qtd_item}
                                id_pedido={pedido.id_pedido}
                                vl_total={pedido.vl_total}
                                dt_pedido={pedido.dt_pedido}
                                id_estabelecimento={pedido.id_estabelecimento}
                                status={pedido.status} />
                    })
                }
            </div>

        </div>
    </div>
}

export default Pedidos;