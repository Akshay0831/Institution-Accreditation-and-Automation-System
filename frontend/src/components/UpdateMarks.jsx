import React, { useState } from "react";

let UpdateMarks = () => {
    const [data, setData] = useState(null);
    let fetchData = async () => {
        let res = await fetch("http://localhost:4000/update_marks");
        setData(await res.json());
    };
    fetchData();
    console.log(data);
    return <>{"" + data}</>;
};

export default UpdateMarks;
