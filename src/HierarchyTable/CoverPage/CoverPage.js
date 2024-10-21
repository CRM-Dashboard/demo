import React, { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "./Style.css";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { TextField, Button, IconButton, Box, Typography } from "@mui/material";
import { AcUnit, AccessTime, Edit, Save, Cancel } from "@mui/icons-material";
import UseCustomSnackbar from "../../crm/components/snackbar/UseCustomSnackBar";

const CoverPage = () => {
  const [events, setEvents] = useState([]);
  const [newEntry, setNewEntry] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editFields, setEditFields] = useState({});
  const [addDataType, setAddDataType] = useState("");
  const [lineColor] = useState("#FFA500");

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;

  const getTableData = () => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/activity/getProjectTracker`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[0].cover.length > 0) {
          setEvents(data[0].cover);
        }
      });
  };

  useEffect(() => {
    getTableData();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (type, index, value) => {
    console.log(
      "###########value to edit with index",
      editFields[type],
      index,
      value
    );
    setEditFields((prevEditFields) => ({
      ...prevEditFields,
      [type]: {
        ...editFields[type],
        [index]: value,
      },
    }));
  };

  const handleEdit = (type) => {
    // Initialize the current comments in editFields
    const currentValues = events
      .filter((event) => event.type === type)
      .reduce((acc, event, index) => {
        acc[index] = event.comments;
        return acc;
      }, {});

    setEditFields({
      ...editFields,
      [type]: currentValues,
    });

    setEditMode({
      ...editMode,
      [type]: true,
    });
  };

  const handleCancel = (type) => {
    setEditMode({
      ...editMode,
      [type]: false,
    });
    setEditFields({
      ...editFields,
      [type]: {},
    });
    setNewEntry({ ...newEntry, [type]: "" }); // Reset new entry
  };

  // const handleSaveEntry = async (type) => {
  //   // Create a copy of the events array
  //   const updatedEvents = events.map((event, index) => {
  //     // Check if the event matches the current type and if there's a new value in editFields
  //     if (event.type === type && editFields[type][index] !== undefined) {
  //       return { ...event, comments: editFields[type][index] }; // Update the comments field
  //     }
  //     return event; // Return the original event if no changes
  //   });

  //   // Update the events state with the modified data
  //   setEvents(updatedEvents);

  //   console.log("updatedData!!!!!!!!!!!", updatedEvents);
  //   const entryData = {
  //     COVER: updatedEvents,
  //   };
  //   const formData = new FormData();
  //   formData.append("userName", userName);
  //   formData.append("passWord", passWord);
  //   formData.append("entryData", JSON.stringify(entryData));

  //   if (Object.keys(updatedEvents)?.length > 0) {
  //     // process.env.REACT_APP_SERVER_URL
  //     fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data) {
  //           editFields({});
  //           setEditMode({});
  //           snackbar.showSuccess("Cover page updated successfully!");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("########error", error);
  //         if (error) {
  //           snackbar.showError(
  //             "Error while updating Cover page. Please try again!"
  //           );
  //         }
  //       });
  //   } else {
  //     snackbar.showError("Something went wrong!");
  //   }
  // };

  const handleNewEntryInput = (type, value) => {
    setNewEntry({
      ...newEntry,
      [type]: value, // Set the new entry value for the given type
    });
  };

  const handleSaveEntry = async (type) => {
    // Create a copy of the events array
    console.log("$$$$$$$$$$$$$editFields", editFields[type]);
    console.log("$$$$$$$$$$$events", events);
    console.log("$$$$$$$$$type", type);

    const updatedTypeEvents = events
      .filter((event) => event.type === type)
      .map((event, eventIndex) => {
        // Check if the editFields for the current type contains this index
        if (editFields[type] && editFields[type].hasOwnProperty(eventIndex)) {
          // Update only the comments field of the matching event
          return { ...event, comments: editFields[type][eventIndex] };
        }
        return event; // No changes if the field wasn't edited
      });

    // Now, merge the updated type events back into the main events array
    const updatedEvents = events.map((event) => {
      // Replace only the events of the specified type
      const updatedEvent = updatedTypeEvents.find(
        (updated) =>
          updated.loIndex === event.loIndex && updated.type === event.type
      );
      return updatedEvent || event; // Return updated or the original event
    });

    console.log("##########updatedEvents", updatedEvents);

    // Update the events state with the modified data
    setEvents(updatedEvents);
    setNewEntry({ ...newEntry, [type]: "" });

    const entryData = {
      COVER: updatedEvents,
    };
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    if (Object.keys(updatedEvents)?.length > 0) {
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setEditFields({});
            setEditMode({});
            getTableData();
            snackbar.showSuccess("Cover page updated successfully!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          snackbar.showError(
            "Error while updating Cover page. Please try again!"
          );
        });
    } else {
      snackbar.showError("Something went wrong!");
    }
  };

  const groupDataByCategory = (type) => {
    const filteredEvents = events.filter((event) => event.type === type);

    return (
      <>
        <ul>
          {filteredEvents.map((item, index) => (
            <li key={index}>{index + 1 + ".   " + item.comments}</li>
          ))}
        </ul>

        {addDataType === type && (
          <>
            <TextField
              label={`New-Entry`}
              value={newEntry[type] || ""}
              onChange={(e) => handleNewEntryInput(type, e.target.value)}
              fullWidth
              multiline
              rows={4}
              style={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveNewEntry(type)}
              style={{ marginTop: "10px" }}
              startIcon={<Save />}
            >
              Save
            </Button>
          </>
        )}
      </>
    );
  };

  const handleSaveNewEntry = (type) => {
    const newEvent = {
      type,
      comments: newEntry[type], // Use the comment entered by the user
      loIndex: events.filter((event) => event.type === type).length + 1,
    };

    const updatedEvents = [...events, newEvent]; // Add new event
    setEvents(updatedEvents);
    setNewEntry({ ...newEntry, [type]: "" }); // Clear the new entry input
    setAddDataType("");

    const entryData = {
      COVER: updatedEvents,
    };
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    if (Object.keys(updatedEvents)?.length > 0) {
      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/createProject`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setEditFields({});
            setEditMode({});
            getTableData();
            snackbar.showSuccess("Cover page updated successfully!");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          snackbar.showError(
            "Error while updating Cover page. Please try again!"
          );
        });
    } else {
      snackbar.showError("Something went wrong!");
    }

    console.log("New entry added:", updatedEvents);
  };

  const renderEditableSection = (title, type, icon, bgColor) => {
    const filteredEvents = events.filter((event) => event.type === type);

    return (
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentStyle={{ background: bgColor, color: "#fff", width: "80%" }} // Increase width
        contentArrowStyle={{
          borderRight: `7px solid ${bgColor}`,
          left: "10px",
        }} // Adjust arrow position
        iconStyle={{ background: bgColor, color: "#fff" }}
        // contentStyle={{ background: bgColor, color: "#fff" }}
        // contentArrowStyle={{ borderRight: `7px solid ${bgColor}` }}
        // iconStyle={{ background: bgColor, color: "#fff" }}
        icon={icon}
        dateClassName="date-text"
        position="right"
      >
        <h3 className="vertical-timeline-element-title">{title}</h3>
        {editMode[type] ? (
          <>
            {filteredEvents.map((item, index) => (
              <TextField
                key={index}
                label={`Edit ${title} - Entry ${index + 1}`}
                value={
                  editFields[type] && editFields[type][index] !== undefined
                    ? editFields[type][index]
                    : item.comments
                }
                onChange={(e) => handleInputChange(type, index, e.target.value)}
                fullWidth
                multiline
                rows={4}
                style={{ marginBottom: "10px" }}
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveEntry(type)}
              style={{ marginTop: "10px" }}
              startIcon={<Save />}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleCancel(type)}
              style={{ marginTop: "10px", marginLeft: "10px" }}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <p>{groupDataByCategory(type) || "No data available"}</p>
            <IconButton onClick={() => handleEdit(type)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => setAddDataType(type)}>
              <AddIcon />
            </IconButton>
          </>
        )}
      </VerticalTimelineElement>
    );
  };

  return (
    <>
      <Box>
        <Typography variant="h5">Coverpage</Typography>
      </Box>
      <div style={{ marginLeft: "-100px", width: "calc(100% + 50px)" }}>
        <VerticalTimeline lineColor={lineColor}>
          {renderEditableSection(
            "Past Month Best",
            "PAST_MTH_BEST",
            <AcUnit />,
            "rgb(16, 204, 82)"
          )}
          {renderEditableSection(
            "Past Month Worst",
            "PAST_MTH_WORST",
            <AccessTime />,
            "rgb(255, 69, 58)"
          )}
          {renderEditableSection(
            "Next Month Excited About",
            "NXT_MTH_BEST",
            <AcUnit />,
            "rgb(33, 150, 243)"
          )}
          {renderEditableSection(
            "Next Month Concerned About",
            "NXT_MTH_CONCERN",
            <AccessTime />,
            "rgb(255, 165, 0)"
          )}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default CoverPage;
