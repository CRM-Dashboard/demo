import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { FaJira } from "react-icons/fa";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function ListAcivity({
  tickets, // Array of tickets (email data)
  onTicketClick, // Function to handle ticket click
  renderTicketAction, // Optional function to render custom actions (like delete)
  listWrapperStyle = {}, // Custom styles for the List container
  listItemStyle = {}, // Custom styles for individual ListItems
  itemTextStyle = {}, // Custom styles for text inside ListItem
  emptyMessage = "No tickets available", // Message to display if the list is empty
}) {
  return (
    <Box
      sx={{
        ...listWrapperStyle,
        padding: 0,
        marginLeft: "1rem",
        marginTop: "1rem",
        paddingTop: 0,
      }}
    >
      <List>
        {tickets?.length > 0 ? (
          tickets?.map((ticket, index) => (
            <ListItem
              key={index}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "8px",
                padding: "12px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
                ...listItemStyle,
              }}
              onClick={() => onTicketClick && onTicketClick(ticket, index)}
              secondaryAction={
                renderTicketAction ? renderTicketAction(ticket, index) : null
              }
            >
              {/* Icon for Time/Date */}

              {/* Ticket Title and Body Preview */}
              <ListItemText
                // primary={ticket.subject}
                primary={`${ticket.activityDes}`}
                sx={{ ...itemTextStyle }}
              />

              {/* Date */}
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  ml: 2,
                  fontSize: "0.675rem",
                  position: "absolute",
                  top: 5,
                  right: 5,
                }}
              >
                {new Date(ticket?.erdat).toLocaleDateString()}
              </Typography>
            </ListItem>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#888" }}
          >
            {emptyMessage}
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default ListAcivity;
