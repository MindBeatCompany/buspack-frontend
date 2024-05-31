import { Badge } from "react-bootstrap";
import "./index.scss";

const BadgeForStatus = ({ state }) => {
  switch (state) {
    case "Pendiente":
      return <Badge variant="pendiente">{state}</Badge>;
    case "Despachado":
      return <Badge variant="despachado">{state}</Badge>;
    case "En Tramite":
      return <Badge variant="en-tramite">{state}</Badge>;
    case "Entregado":
      return <Badge variant="entregado">{state}</Badge>;
    case "En Tránsito":
      return <Badge variant="en-tramite">{state}</Badge>;
    default:
      return <Badge variant="entregado">{state}</Badge>;
   
  }
};

export default BadgeForStatus;
