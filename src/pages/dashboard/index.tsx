import Dealer from "@/components/dashboard/Dealer";
import Distributor from "@/components/dashboard/Distributor";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const router = useRouter();
  const { isLoggedIn, loggedInUser } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isLoggedIn || !loggedInUser?.companyName) {
      router.push("/login");
    }
  }, [router, isLoggedIn, loggedInUser]);

  return <>{loggedInUser?.type === "Dealer" ? <Dealer /> : <Distributor />}</>;
};

export default Dashboard;
