import React, { useState, useEffect, useRef } from "react";
import { NavBarUser } from "../components/NavBarUser";
import { useSelector } from "react-redux";
import { Grid, TextField, Button } from "@mui/material";
import "./ListingSelected.css";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import JobSelected from "../components/ListingSelected/JobSelected";
import swal from "sweetalert";
import LoadingBackdrop from "../components/LoadingBackdrop/LoadingBackdrop";
import Modal from "@mui/material/Modal";
import JobApplicationForm from "../components/JobApplicationForm/JobApplicationForm";
import notLoggedMessage from "../constants/notLoggedin.constant";

function ListingSelected(props) {
  const listingSelected = useSelector(
    (state) => state.listings.listingSelected
  );

  const jobId = listingSelected ? listingSelected.jobId : console.log("error");

  const { email } = useSelector((state) => state.user);
  const { uid } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobAlreadyApplied, setIsJobAlreadyApplied] = useState(null);
  const [jobAlreadyAppliedData, setJobAlreadyAppliedData] = useState({});
  const [hideNavbar, setHideNavbar] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (email.length > 0) {
      fetchJobsApplied();
    }
    if (!listingSelected) {
      navigate("/listings");
    }
    if (Object.keys(props).length != 0) {
      setHideNavbar(props.hideNavbar);
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const fetchJobsApplied = async () => {
    setIsLoading(true);
    // get firebase document
    const jobPortalRef = collection(db, "jobPortal");
    const q = query(
      jobPortalRef,
      where("email", "==", email),
      where("jobId", "==", jobId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setJobAlreadyAppliedData(doc.data());
      if (Object.keys(doc.data()).length != 0) {
        setIsJobAlreadyApplied(true);
      } else {
        setIsJobAlreadyApplied(false);
      }
    });

    setIsLoading(false);
  };

  const applyButtonHandler = () => {
    if (email.length == 0) {
      swal(
        notLoggedMessage.title,
        notLoggedMessage.message,
        "error"
      ).then(() => navigate("/"));
    } else {
      setShowApplicationForm(true);
    }
  };

  const closeButtonHandler = () => {
    setShowApplicationForm(false);
  };

  const propsCloseButtonHandler = () => {
    props.onClose();
  };
  return (
    <div className="listing-selected-div" ref={ref}>
      {!hideNavbar && <NavBarUser />}
      {isLoading && <LoadingBackdrop />}
      {/* selected listing details */}
      <Grid container justifyContent="center" className="listing-container">
        <Grid item xs={12} md={8} className="listing-grid-item">
          {hideNavbar && (
            <p
              className="dashboard-close-button"
              onClick={propsCloseButtonHandler}
            >
              X
            </p>
          )}
          {listingSelected && <JobSelected />}
          {isJobAlreadyApplied ? (
            <>
              <h4 className="listing-selected-alert-message">
                You have already applied for this job. If you want to edit the
                same, please click below:
              </h4>
              <div className="listing-selected-button-div">
                <Button
                  onClick={applyButtonHandler}
                  variant="outlined"
                  color="success"
                  style={{
                    textTransform: "none",
                    width: "12.5rem",
                    borderColor: "#2bb792",
                    borderWidth: "2px",
                    backgroundColor: "#2bb792",
                    color: "white",
                    fontFamily: "Segoe UI",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Button>
              </div>
            </>
          ) : (
            <div className="listing-selected-button-div">
              <Button
                onClick={applyButtonHandler}
                variant="outlined"
                color="success"
                style={{
                  textTransform: "none",
                  width: "12.5rem",
                  borderColor: "#2bb792",
                  borderWidth: "2px",
                  backgroundColor: "#2bb792",
                  color: "white",
                  fontFamily: "Segoe UI",
                  fontWeight: 600,
                }}
              >
                Apply
              </Button>
            </div>
          )}
        </Grid>
      </Grid>

      <Modal open={showApplicationForm} onClose={closeButtonHandler}>
        <Grid
          container
          justifyContent="center"
          className="listing-selected-container-second"
        >
          <Grid item xs={11} sm={6} className="listing-grid-modal">
            <p
              className="listing-selected-close-button"
              onClick={closeButtonHandler}
            >
              X
            </p>
            <JobApplicationForm
              isJobAlreadyApplied={isJobAlreadyApplied}
              jobAlreadyAppliedData={jobAlreadyAppliedData}
            />
          </Grid>
        </Grid>
      </Modal>
    </div>
  );
}

export default ListingSelected;
