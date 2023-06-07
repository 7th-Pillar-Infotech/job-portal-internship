import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import { NavBarUser } from "../../components/NavBarUser";
import { useDispatch, useSelector } from "react-redux";
import { Grid, IconButton } from "@mui/material";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { jobListings } from "../../features/jobListingsSlice";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";
import ListingSelected from "../ListingSelected";
import DashboardData from "./DashboardData";

function Dashboard() {
  const { email } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  const [jobsApplied, setJobsApplied] = useState([]);
  const [jobsFavorite, setJobsFavorite] = useState([]);
  const [jobsApplicationData, setJobsApplicationData] = useState([]);
  const dispatch = useDispatch();
  const [showListingSelected, setShowListingSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showJobsApplied, setShowJobsApplied] = useState(true);
  const [favoriteSelectedJobId, setFavoriteSelectedJobId] = useState("");
  const ref = useRef(null);
  const topRef = useRef(null);

  const fetchJobListings = async () => {
    axios.get("./joblistings.json").then((res) => {
      dispatch(jobListings(res.data));
    });
  };

  useEffect(() => {
    fetchJobsApplied();
    //to prevent data lost after refresh
    fetchJobListings();
  }, [email]);

  const fetchJobsApplied = async () => {
    setIsLoading(true);
    // get firebase document
    const jobPortalRef = collection(db, "jobPortal");
    const q = query(jobPortalRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let jobsApplicationData = [];
    querySnapshot.forEach((doc) => {
      jobsApplicationData.push({
        jobId: doc.data().jobId,
        date: doc.data().date,
      });
    });

    let filteredListings = [];
    setJobsApplicationData(jobsApplicationData);
    jobsApplicationData.map((item) => {
      listings.map((listing) => {
        if (item.jobId == listing.jobId) {
          filteredListings.push(listing);
        }
      });
    });
    setJobsApplied(filteredListings);
    setIsLoading(false);
  };

  const closeButtonHandler = () => {
    setShowListingSelected(false);
    window.scrollTo(0, 0);
  };

  const showListingSelectedHandler = () => {
    setShowListingSelected(true);
  };

  const favoriteButtonHandler = async () => {
    setShowFavorites(true);
    setShowJobsApplied(false);

    setIsLoading(true);
    const jobPortalExistingFavoritesRef = doc(db, "jobPortalFavorites", email);
    let jobsFavoriteData = [];
    const docSnapshot = await getDoc(jobPortalExistingFavoritesRef);

    try {
      if (docSnapshot.data().favorite.constructor === Array) {
        jobsFavoriteData = docSnapshot.data().favorite;

        let filteredListings = [];
        jobsFavoriteData.map((item) => {
          listings.map((listing) => {
            if (item == listing.jobId) {
              filteredListings.push(listing);
            }
          });
        });

        setJobsFavorite(filteredListings);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const jobsAppliedButtonHandler = () => {
    setShowFavorites(false);
    setShowJobsApplied(true);
  };

  return (
    <div className="dashboard" ref={topRef}>
      <NavBarUser />
      <Grid
        container
        justifyContent="center"
        className="dashboard-container"
        alignItems="center"
        direction="row"
      >
        <Grid item md={11} xs={11} className="dashboard-grid-item">
          <Grid container>
            <Grid item md={9} xs={11}></Grid>
            <Grid item md={3} xs={11} className="dashboard-icon">
              {showJobsApplied ? (
                <IconButton
                  sx={{ color: "#F45050" }}
                  onClick={favoriteButtonHandler}
                  className="dashboard-favorite-button"
                >
                  <FavoriteIcon className="listing-favorite-icon" />
                  <p className="dashboard-favorites-word">
                    Click for Favorites{" "}
                  </p>
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "#482121" }}
                  onClick={jobsAppliedButtonHandler}
                  className="dashboard-work-button"
                >
                  <WorkIcon className="listing-work-icon" />
                  <p className="dashboard-work-word">Click for Jobs Applied </p>
                </IconButton>
              )}
            </Grid>
          </Grid>

          <DashboardData
            showFavorites={showFavorites}
            rowData={showFavorites ? jobsFavorite : jobsApplied}
            isLoading={isLoading}
            onShowListingSelected={showListingSelectedHandler}
          />
        </Grid>
      </Grid>

      <div ref={ref}>
        {showListingSelected && (
          <ListingSelected hideNavbar={true} onClose={closeButtonHandler} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
