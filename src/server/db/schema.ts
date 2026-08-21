import {
  User,
  Vehicle,
  Driver,
  Client,
  Passenger,
  Route,
  Trip,
  VehicleLocation,
  MaintenanceRecord,
  DocumentRecord,
  NotificationRecord,
  InquiryRecord,
  SalikTransaction,
} from '../../types/index.js';

export interface DatabaseSchema {
  users: User[];
  vehicles: Vehicle[];
  drivers: Driver[];
  clients: Client[];
  passengers: Passenger[];
  routes: Route[];
  trips: Trip[];
  locations: VehicleLocation[];
  maintenance: MaintenanceRecord[];
  documents: DocumentRecord[];
  notifications: NotificationRecord[];
  inquiries: InquiryRecord[];
  salikTransactions: SalikTransaction[];
  systemMeta: {
    initializedAt: string;
    version: string;
    seedVersion: string;
    lastBackupAt?: string;
  };
}

export type TableName = keyof Omit<DatabaseSchema, 'systemMeta'>;

