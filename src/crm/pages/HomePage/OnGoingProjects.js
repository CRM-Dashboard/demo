/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardActions,
  Typography,
  Button,
  CardContent,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import homePageAction from "./HomePageReducer/HomePageAction";
import dashoardActions from "./../Dashboard/DashboardReducer.js/DashboardActions";

export default function OnGoingProjects() {
  const [Projects, SetProjects] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const setUniqueProjectData = (data) => {
    const UniqueProjects = [];
    data.forEach((obj) => {
      const ProjectName = obj.name_hdr;
      if (!UniqueProjects[ProjectName]) {
        UniqueProjects[ProjectName] = { ProjectName, subProject: [] };
      }
      UniqueProjects[ProjectName].subProject.push(obj);
    });
    SetProjects(Object.values(UniqueProjects));
  };

  const getImages = (pr) => {
    if (pr === "Gera's World of Joy") {
      return require("./../../../assets/Gera's World of Joy.jpg");
    } else if (pr === "Gera's Planet of Joy") {
      return require("./../../../assets/Gera's Planet of Joy.jpg");
    } else if (pr === "Gera's Imperium Gateway") {
      return require("./../../../assets/Gera's Imperium Gateway.jpg");
    } else if (pr === "Gera's Island of Joy") {
      return require("./../../../assets/island_of_joy.jpg");
    }
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(process.env.REACT_APP_SERVER_URL + "/api/project", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.ProjectList?.length) {
          dispatch(homePageAction.setAllProjects(data?.ProjectList));
        }

        const AllProjectsData = data?.ProjectList;
        if (AllProjectsData) {
          const filteredData = AllProjectsData?.filter(
            (data) => data.ongoingIndicator === "X"
          );
          setUniqueProjectData(filteredData);
        }
      });
  }, [dispatch]);

  const showCard = (project) => {
    return (
      <Card
        sx={{
          width: 260,
          height: "35em",
          margin: "1em",
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{ height: 210 }}
            image={getImages(project.ProjectName)}
            alt="Property"
          />
          <CardContent>
            <Typography gutterBottom>{project.ProjectName}</Typography>
          </CardContent>
          {project?.subProject?.map((sub) => {
            return (
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  overflowY: "auto",
                }}
              >
                <Grid>
                  <Button
                    sx={{
                      borderRadius: "1em",
                      width: "18em",
                      height: "2.3em",
                    }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      navigate("/crm/crm/dashboard");
                      dispatch(dashoardActions.setProjectId(sub));
                    }}
                  >
                    {sub?.name_item}
                  </Button>
                </Grid>
              </CardActions>
            );
          })}
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        bgcolor: "#F3F5F7",
        display: "flex",
        padding: "2em",
      }}
      justifyContent="center"
      display="flex"
      flexDirection="row"
    >
      {Projects && Projects?.map((project) => showCard(project))}
    </Grid>
  );
}
