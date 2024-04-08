import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../@core/components/page-header";
import InsightForm from "src/component/insight/InsightForm";

export default function CreteOptionType() {


    return (
        <div>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <PageHeader
                        title={
                            <Typography variant='h5'>
                                Insight
                            </Typography>
                        }
                        subtitle={
                            <Typography variant='body2'>
                                Create
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item>

                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <InsightForm />
                </Grid>

            </Grid>
        </div>
    )
}
