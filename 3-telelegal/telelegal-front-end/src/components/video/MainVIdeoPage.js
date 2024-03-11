import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const MainVideoPage = () => {
  // 从URL的 Query String 中获取Token内容
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState({});

  useEffect(() => {
    const token = searchParams.get("token");
    const fetchDecodedToken = async () => {
      const resp = await axios.post("https://localhost:9000/validate-link", {
        token,
      });
      const data = resp.data;
      console.log(data);
      setApptInfo(data);
    };

    fetchDecodedToken();
  }, []);

  return (
    <h1>
      {apptInfo.professionalsFullName} at {apptInfo.apptDate}
    </h1>
  );
};

export default MainVideoPage;
