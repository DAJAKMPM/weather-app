import { AxiosResponse } from "axios";
import { OPEN_WEATHER_MAP_KEY } from "@env";
import { locationInstance } from "@app/api";
import { AppDispatch, AppThunk } from "@app/redux/store";
import { ResponseError } from "@app/redux/api-models/common";
import { BaseResponse } from "@app/redux/api-models/location";

import { locationActions } from "./slices";

const {
  setLocationRequest,
  setLocationSuccess,
  setLocationFailure,
  resetLocation,
} = locationActions;

/**
 * Trigger's the axios call for the locations GET method
 * @param query
 * @returns query output
 */
const getLocationsData = (query: string) => {
  return locationInstance.get<BaseResponse>(
    `direct?q=${query}&limit=5&appid=${OPEN_WEATHER_MAP_KEY}`
  );
};

/**
 * Processes the location API call
 * and stores the corresponding data
 * in redux state
 * @param payload
 * @returns void
 */
const callLocationApi =
  (payload: string): AppThunk =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLocationRequest());

      const response: AxiosResponse<BaseResponse> = await getLocationsData(
        payload
      );

      dispatch(setLocationSuccess(response?.data));
    } catch (error) {
      dispatch(setLocationFailure(error as ResponseError));
    }
  };

const actions = {
  callLocationApi,
  resetLocation,
};

export default actions;
