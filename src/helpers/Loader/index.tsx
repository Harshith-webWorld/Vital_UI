import React, { useEffect, useState } from "react";
import { BoxLoading } from 'react-loadingg';

const Loader: React.FC = (props: any) => {

    const [loader, setLoader] = useState(false)
    return (
            <div className="loader">
                <BoxLoading />
            </div>
       
    )
}
export default Loader;