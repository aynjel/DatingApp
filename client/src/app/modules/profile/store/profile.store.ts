import { signalStore, withState } from '@ngrx/signals';
import { User } from '../../../shared/models/user.model';

type ProfileStoreType = {
  userProfile: User | undefined;
};

const initialState: ProfileStoreType = {
  userProfile: undefined,
};

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState)
);
