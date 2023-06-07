import React, { useEffect, useState, useRef } from "react";
import { Grid, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import {
  jobListingSelected,
  jobListings,
} from "../../features/jobListingsSlice";
import { useDispatch, useSelector } from "react-redux";
import ListingSelected from "../ListingSelected";

function DashboardData(props) {
  const dispatch = useDispatch();
  const { showFavorites } = props;
  const { rowData } = props;
  const { isLoading } = props;
  console.log(showFavorites);
  console.log(rowData);
  const [jobsApplied, setJobsApplied] = useState([]);
  const [showListingSelected, setShowListingSelected] = useState(false);
  const isMobileView = window.innerWidth < 600;
  const ref = useRef(null);
  const topRef = useRef(null);

  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param.field === "view";
  };

  const scrollDown = () => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const viewMoreClickHandler = (row) => {
    dispatch(jobListingSelected(row.row));
    props.onShowListingSelected();
    scrollDown();
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      hide: true,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "view",
      headerName: "View Details",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (row) => {
        return (
          <Button
            size="small"
            onClick={() => viewMoreClickHandler(row)}
            sx={{ padding: 0 }}
          >
            <RemoveRedEyeSharpIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center">
        <h3 className="dashboard-heading">
          {showFavorites ? "Favorite Jobs" : "Jobs applied"}
        </h3>
        <Grid item xs={12} className="dashboard-grid-item-2">
          <DataGrid
            HorizontalScrollBarVisibility="Hidden"
            rows={rowData}
            getRowId={(row) => row.jobId}
            columns={columns}
            disableSelectionOnClick
            disableRowSelectionOnClick
            hideFooterPagination
            hideFooter
            hideFooterSelectedRowCount
            showCellRightBorder
            autoHeight
            keepNonExistentRowsSelected
            onCellClick={handleCellClick}
            columnVisibilityModel={{
              // Hide columns
              title: !isMobileView,
              location: !isMobileView,
            }}
            slots={{
              noRowsOverlay: () => (
                <div className="dashboard-nodata-div">
                  <p className="dashboard-nodata-message">
                    Nil Job Applications so far...
                  </p>
                </div>
              ),
              loadingOverlay: LinearProgress,
            }}
            loading={isLoading}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default DashboardData;
