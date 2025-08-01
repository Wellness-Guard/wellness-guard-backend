import { BadRequestError } from '@oristic/common';
import { TrackInterface } from '../@types/interfaces';
import Track from '../modals/Track';
export const saveTrack = async (attr: TrackInterface) => {
     try {
          const result = await Track.save(attr);
          return result;
     } catch (err) {
          throw new BadRequestError((err as Error).message);
     }
};

export const fetchTracksByMedication = async (medication_id: string) => {
     try {
          const result = await Track.getTracksById(medication_id);
          return result;
     } catch (err) {
          throw new BadRequestError((err as Error).message);
     }
};
