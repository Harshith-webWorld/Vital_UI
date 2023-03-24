
import { useSelector } from 'react-redux';

export const useUserDistrictId = () => {
    const userDistrictId = useSelector((state) => (state && state.Admin && state.Admin.signin) && state.Admin.signin?.data?.districtId ? state.Admin.signin?.data?.districtId : "")
    return userDistrictId || "";
}