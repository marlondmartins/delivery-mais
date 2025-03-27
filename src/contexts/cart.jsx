import { createContext, useEffect, useState } from 'react';
import api from '../services/api';

const CartContext = createContext({});

function CartProvider(props){
     
    const [cart, setCart] = useState([]);
    const [subtotalCart, setSubtotalCart] = useState(0);
    const [descontoCart, setDescontoCart] = useState(0);
    const [entregaCart, setEntregaCart] = useState(0);
    const [idCupomCart, setIdCupomCart] = useState(0);
    const [cupomCart, setCupomCart] = useState('');
    const [msgCart, setMsgCart] = useState('');
    const [totalCart, setTotalCart] = useState(0);
    const [idEstabelecimentoCart, setIdEstabelecimentoCart] = useState(0);
 
    function SalvarCart(produtos){

        if (produtos.length > 0) {
            
            localStorage.setItem('sessionCart', JSON.stringify({
                cupom: cupomCart,
                id_cupom: idCupomCart,
                id_estabelecimento: idEstabelecimentoCart,
                entrega: entregaCart,
                itens: produtos
            }));
        } else {
            localStorage.removeItem('sessionCart');
        }

        /*
        {
            "cupom":"SUPER10",
            "id_cupom": "123",
            "id_estabelecimento":"2",
            "entrega":3.5,
            "itens":[{
                        "id_carrinho":"e08d3a54-a511-4b8e-82e0-eb2a74e811e7",
                        "id_produto":2,
                        "nome":"Black Dog Cheddar Bacon",
                        "qtd":1,
                        "vl_unit":22.9,
                        "url_foto":"https://ifood.com.br/image/foto.jpg",
                        "detalhes":[]
                    }]
        }
        */

    }

    function AddItemCart(item){
        setCart([...cart, item]);
        SalvarCart([...cart, item]);
    }

    function RemoveItemCart(id){
        const novoCart = cart.filter((item, index, arr) => {
            return item.id_carrinho != id;
        });
 
        setCart(novoCart);
        SalvarCart(novoCart);
    }

    function ValidarCupom(){
        setMsgCart('');
        SalvarCart(cart);

        api.get('v1/cupons/validacao', {
            params: {
                cod_cupom: cupomCart,
                valor: Math.trunc(subtotalCart * 100),
                id_estabelecimento: idEstabelecimentoCart
            }
        })
        .then(response => {
            if (response.data) {
                let porc_cupom = response.data.porc_cupom; // 5
                let vl_cupom = response.data.vl_cupom;  // 10.00

                setIdCupomCart(response.data.id_cupom);
                setDescontoCart(vl_cupom  + (subtotalCart * porc_cupom / 100));
            } else {
                setIdCupomCart(0);
                setDescontoCart(0);
                setMsgCart('Cupom inválido');
            }
        })
        .catch(err => {
            setIdCupomCart(0);
            setDescontoCart(0);
            setMsgCart('Cupom inválido');
            console.log(err);
        });
    }

    useEffect(() => {
        const dados = localStorage.getItem('sessionCart');

        if (dados){
            setCart(JSON.parse(dados).itens);
            setCupomCart(JSON.parse(dados).cupom);
            setIdEstabelecimentoCart(JSON.parse(dados).id_estabelecimento);
            setEntregaCart(JSON.parse(dados).entrega);
            setIdCupomCart(JSON.parse(dados).id_cupom);
        }
    }, []);

    useEffect(() => {
        if (cupomCart.length > 0) {
            ValidarCupom();
        }
    }, [subtotalCart]);

    useEffect(() => {
       setMsgCart('');
    }, [cupomCart]);
   
    useEffect(() => {
        let soma = cart.reduce((a, b) => a + (b.vl_unit * b.qtd), 0);

        setSubtotalCart(soma);
    }, [cart]);

    useEffect(() => {    
        setTotalCart(subtotalCart - descontoCart + entregaCart);
    }, [subtotalCart, descontoCart, entregaCart]);

    return <CartContext.Provider value={{cart, setCart, subtotalCart, setSubtotalCart, descontoCart, setDescontoCart,
                                        entregaCart, setEntregaCart, idCupomCart, setIdCupomCart, totalCart, setTotalCart,
                                        idEstabelecimentoCart, setIdEstabelecimentoCart, AddItemCart, RemoveItemCart,
                                        ValidarCupom, cupomCart, msgCart, setCupomCart, setMsgCart}}>
        {props.children}
    </CartContext.Provider>
}

export {CartContext, CartProvider};