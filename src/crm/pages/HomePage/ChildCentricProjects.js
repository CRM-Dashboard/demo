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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import dashoardActions from "./../Dashboard/DashboardReducer.js/DashboardActions";

export default function ChildCentricProjects() {
  const [Projects, SetProjects] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homePageReducer = useSelector((state) => state);

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
    const AllProjectsData = homePageReducer?.homePage?.allProjects;
    if (AllProjectsData) {
      const filteredData = AllProjectsData?.filter(
        (data) => data.childcentricIndicator === "X"
      );
      setUniqueProjectData(filteredData);
    }
  }, [homePageReducer?.homePage?.allProjects]);

  const showCard = (project) => {
    return (
      <Card sx={{ width: 260, height: "35em", margin: "1em" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{ objectFit: "cover contain", height: 210 }}
            image={getImages(project.ProjectName)}
            alt="Property"
          />
          <CardContent>
            <Typography gutterBottom variant="h7">
              {project?.ProjectName}
            </Typography>
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
                <Grid key={sub?.projectId}>
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
        direction: "row",
        justify: "flex-center",
        alignItems: "flex-start",
        padding: "2em",
      }}
      justifyContent="center"
      alignItems="center"
      alignContent="center"
    >
      {Projects && Projects?.map((project) => showCard(project))}
    </Grid>
  );
}
