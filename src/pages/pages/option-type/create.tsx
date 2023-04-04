import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../@core/components/page-header";
import OptionTypeForm from 'src/component/optionType/OptionTypeForm';


export default function CreteOptionType() {


    return (
        <div>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <PageHeader
                        title={
                            <Typography variant='h5'>
                                Option Type
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
                    <OptionTypeForm />
                </Grid>

            </Grid>
        </div>
    )
}
