// AccordionFilter.js
import React, { memo } from 'react';
import { Grid, Button, Checkbox, MenuItem, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputField from '../../../components/inputField/InputField';

const AccordionFilter = memo(({
    projectData,
    crmData,
    selectedCrmIds,
    selectedProjects,
    handleProjectSelection,
    handleCrmSelection,
    getTableData,
    loading,
}) => {
    return (
        <Grid sx={{ marginTop: '0.5em' }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.9em' }}>Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            paddingBottom: '2em',
                            alignItems: 'left',
                            justifyContent: 'left',
                            border: '1px solid white',
                            borderRadius: '18px',
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Grid container spacing={2} sx={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}>
                            <Grid item xs={4}>
                                <InputField
                                    select
                                    label="Project"
                                    value={selectedProjects}
                                    onChange={handleProjectSelection}
                                    SelectProps={{
                                        multiple: true,
                                        renderValue: (selected) =>
                                            selected
                                                .map((id) => projectData.find((project) => project.projectId === id)?.name)
                                                .join(', '),
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Select Project</em>
                                    </MenuItem>
                                    {projectData?.map((project) => (
                                        <MenuItem key={project.projectId} value={project.projectId}>
                                            <Checkbox checked={selectedProjects.indexOf(project.projectId) > -1} />
                                            {project.name}
                                        </MenuItem>
                                    ))}
                                </InputField>
                            </Grid>

                            <Grid item xs={4}>
                                <InputField
                                    select
                                    label="CRM"
                                    value={selectedCrmIds}
                                    onChange={handleCrmSelection}
                                    SelectProps={{
                                        multiple: true,
                                        renderValue: (selected) =>
                                            selected
                                                .map((id) => crmData.find((crm) => crm.crmId === id)?.name)
                                                .join(', '),
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Select CRM</em>
                                    </MenuItem>
                                    {crmData?.map((crm) => (
                                        <MenuItem key={crm.crmId} value={crm.crmId}>
                                            <Checkbox checked={selectedCrmIds.indexOf(crm.crmId) > -1} />
                                            {crm.name}
                                        </MenuItem>
                                    ))}
                                </InputField>
                            </Grid>

                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Button
                                    disabled={
                                        (selectedCrmIds?.toString()?.trim()?.length === 0 &&
                                            selectedProjects?.toString()?.trim()?.length === 0) ||
                                        loading
                                    }
                                    variant="contained"
                                    onClick={getTableData}
                                >
                                    Apply
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
});

export default AccordionFilter;
