import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, updateProductIdText } from '../redux/actions/productActions';

const columns = [
  { id: 'id', label: 'ID', minWidth: 10 },
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'year',
    label: 'Year',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
];

const PER_PAGE = 5;
let rows = [];
let totalRows = 0;
let inputProductIdText = '';

export default function TableProducts() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  
  // Get Products Data
  const dataRequest = async (page = 1) => {
    const productsData = await axios
      .get(`https://reqres.in/api/products?per_page=${PER_PAGE}&page=${page}`)
      .catch((err) => {console.log({"error": err})});
    if (!productsData) 
      console.log("No products");
    else
      dispatch(setProducts(productsData.data));
  }

  // Get Product Data By ID
  const dataRequestByID = async (id) => {
    const productsData = await axios
      .get(`https://reqres.in/api/products?id=${id}`)
      .catch((err) => {console.log({"error": err})});
    if (!productsData) 
      console.log("No this product");
    else {
      let data = {data: [productsData.data.data]};
      dispatch(setProducts(data));
    }
  }

  React.useEffect(() => {
    dataRequest();
    // eslint-disable-next-line
  }, []);

  let data = state.productsPage.productsData.data;
  if (data) {
    if (data.length !== 1) {
      totalRows = state.productsPage.productsData.total;
    }
    else {
      totalRows = 1;
    }
  }
  rows = state.productsPage.productsData.data;
  inputProductIdText = state.productsPage.inputProductIdText;

  if (!rows) rows = [];
  if (!totalRows) totalRows = 0;

  // Action Functions
  const updateInputText = (e) => {
    const inputText = e.target.value;
    const re = /^[0-9\b]+$/;
    if (inputText !== '') {
      if (re.test(inputText)) {
        dispatch(updateProductIdText(inputText));
        dataRequestByID(inputText);
      }
    }
    else {
      dispatch(updateProductIdText(inputText));
      dataRequest(0);
    }
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(PER_PAGE);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dataRequest(newPage + 1)
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <div className="app_wrapper">
      {"Product ID: "}
      <input
        onChange={updateInputText}
        type="text"
        value={inputProductIdText}
        placeholder="enter id of pruduct"
      />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .map((row) => {
                  return (
                    <TableRow hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.id} 
                      style={{backgroundColor: row.color}}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
