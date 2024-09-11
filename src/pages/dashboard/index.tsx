import Dealer from "@/components/dashboard/Dealer";
import Distributor from "@/components/dashboard/Distributor";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return <>{user?.type === "Dealer" ? <Dealer /> : <Distributor />}</>;
};

export default Dashboard;
