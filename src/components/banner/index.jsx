import './style.css';
import { Link } from "react-router-dom";

function Banner(props){
    return <div className="banner col-sm-6 col-lg-3 mb-3">
        <Link to={`/busca?id_banner=${props.id_banner}&descr=${props.descricao}`}>
            <div>
                <img className="img-banner" src={props.url_imagem} alt="Banner" />
            </div>
        </Link>
    </div>
}

export default Banner;