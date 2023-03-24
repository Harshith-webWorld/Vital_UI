import {
  Card,
  Box,
  Typography,
  styled,
  CircularProgress,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import dashboardService from '../../helpers/services/dashboardService';

const MDCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
  boxShadow:
    '0rem 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 10%), 0rem 0.125rem 0.25rem -0.0625rem rgb(0 0 0 / 6%)',
  overflow: 'visible',
  height: '100%',
}));
const MDTitle = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontSize: '1rem',
  lineheight: ' 1.625',
  color: '#344767',
  fontWeight: 700,
  letterSpacing: '0.0075em',
  opacity: 1,
  textTransform: 'capitalize',
  verticalalign: 'unset',
}));

function Stockavailability() {
  const [tablelist] = useState([
    {
      id: '1',
      districtName: 'Chandrapur',
      unit: 'NFCU Chandrapur	',
      tablet: 'DEC 100mg	',
      availablestock: '100',
      batchno: 'B1000',
      expirydate: '21-03-22',
    },
    {
      id: '2',
      districtName: 'Chandrapur',
      unit: 'NFCU Chandrapur	',
      tablet: 'Albendazole	',
      availablestock: '150',
      batchno: 'B1001',
      expirydate: '21-03-22',
    },
    {
      id: '3',
      districtName: 'Chandrapur',
      unit: 'NFCU Chandrapur	',
      tablet: 'Ivermectin (Mactizine)',
      availablestock: '200',
      batchno: 'B1002',
      expirydate: '21-03-22',
    },
  ]);
  const [columns] = useState([
    {
      name: 'S.No',
      selector: 'id',
      width: '100px',
    },
    {
      name: 'District',
      selector: 'districtName',
      width: '120px',
    },
    {
      name: 'Unit',
      selector: 'unit',
      width: '120px',
    },
    {
      name: 'Tablet',
      selector: 'tablet',
    },
    {
      name: 'Available Stock',
      selector: 'availablestock',
    },
    {
      name: 'Batch No./Expiry Date',
      selector: (row) => <div>{row.batchno}/{row.expirydate}</div>,
    }
  ]);
  async function getFSUTargets() {
    const response = await dashboardService.DashboardFSUTargets();
    if (response && response.data && response.data.length > 0) {
      // settablelist(response.data)
    }
  }
  useEffect(() => {
    getFSUTargets();
  }, []);

  return (
    <MDCard>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        p={2}>
        <Box>
          <MDTitle variant='h6' gutterBottom>
            Stock Availability
          </MDTitle>
        </Box>
      </Box>
      <Box style={{ margin: '0px 10px 10px 10px' }}>
        <div className='dash-table'>
          <DataTable
            columns={columns}
            data={tablelist}
            highlightOnHover
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            paginationComponentOptions={{
              rowsPerPageText: 'Records per page:',
              rangeSeparatorText: 'out of',
            }}
          />
        </div>
      </Box>
    </MDCard>
  );
}

export default Stockavailability;
