import {CheckedRoutes} from "../RoutesMap";
import * as React from "react";
import {MetaRawData} from "../types";
import {FormControlLabel} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import {useCallback} from "react";


interface Props {
    transport: string,
    query: string,
    checked: CheckedRoutes,
    onChangeRoot: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    metaRawData: MetaRawData[],
}

export const RoutesNavRow =
    ({checked, metaRawData, onChange, onChangeRoot, query, transport}: Props) => {
        const filter = useCallback((x: MetaRawData) => `${x.rn}`.toLowerCase().includes(query), [query]);
        return <React.Fragment>
            <FormControlLabel
                label={transport}
                control={
                    <Checkbox
                        name={transport}
                        checked={checked[transport].checked}
                        indeterminate={checked[transport].indeterminate}
                        onChange={onChangeRoot}
                    />
                }
            />
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                ml: 3,
            }}>
                {
                    metaRawData
                        .filter(filter)
                        .map((v) =>
                            <FormControlLabel
                                key={v.ri}
                                label={v.rn}
                                name={`${transport}%${v.ri}`}
                                control={<Checkbox
                                    size={'small'}
                                    checked={checked[transport].children[v.ri]}
                                    onChange={onChange}
                                />}
                            />)
                }
            </Box>
        </React.Fragment>;
    };
