/**
 * Shared TypeScript types & interfaces for Dubai Staff Transport Management System (TMS)
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'DISPATCHER' | 'DRIVER' | 'CLIENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  department?: string;
  companyId?: string; // For CLIENT role
  clientId?: string;  // Alias for companyId
  driverId?: string;  // For DRIVER role
  createdAt: string;
  updatedAt: string;
}

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'INACTIVE';
export type VehicleType = 'LUXURY_COACH' | 'MINIBUS' | 'STANDARD_BUS' | 'HIACE_VAN' | 'COASTER' | 'EXECUTIVE_VAN';

export interface Vehicle {
  id: string;
  vehicleNumber: string;       // e.g. "BUS-101"
  registrationNumber: string;  // Dubai plate e.g. "DXB-K-54219"
  plateCategory: string;       // e.g. "Dubai Private Transport" / "Commercial"
  vehicleType: VehicleType;
  make: string;                // e.g. "Toyota", "King Long", "Mercedes-Benz", "Yutong"
  model: string;               // e.g. "Coaster 30-Seater", "HiAce Super Long"
  year: number;
  capacity: number;
  status: VehicleStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  currentRouteId?: string;
  currentRouteName?: string;
  insuranceExpiry: string;
  registrationExpiry: string;  // Mulkiya expiry
  rtaPermitExpiry: string;
  nextMaintenanceDate: string;
  currentMileageKm: number;
  fuelType: 'DIESEL' | 'PETROL' | 'EV';
  createdAt: string;
  updatedAt: string;
}

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'ON_LEAVE' | 'INACTIVE';

export interface Driver {
  id: string;
  employeeId: string;          // e.g. "DRV-204"
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;       // UAE Driving License
  licenseCategory: string;     // Heavy Bus (Category 6) / Light Bus (Category 5)
  licenseExpiry: string;
  rtaCardNumber: string;       // RTA Driver Permit
  rtaCardExpiry: string;
  visaExpiry: string;
  medicalFitnessExpiry: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  joiningDate: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  totalTripsCompleted: number;
  safetyRating: number; // 1.0 to 5.0
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';

export interface Client {
  id: string;
  companyName: string;
  industry: string;            // e.g. "Construction & Engineering", "Aviation & Ground Handling", "Hospitality", "Healthcare"
  tradeLicenseNumber: string;
  contactPerson: string;
  contactTitle: string;
  email: string;
  phone: string;
  officeLocation: string;      // e.g. "Dubai Investment Park 2, Dubai"
  contractStartDate: string;
  contractEndDate: string;
  contractValueAed: number;
  paymentTerms: string;        // e.g. "Net 30 Days"
  billingCycle?: string;
  status: ClientStatus;
  activeRoutesCount: number;
  totalPassengersCount: number;
  assignedVehiclesCount: number;
  createdAt: string;
  updatedAt: string;
}

export type PassengerStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Passenger {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  email?: string;
  clientId: string;
  clientCompanyName?: string;
  department?: string;
  pickupPoint: string;
  pickupTime: string;          // "06:15 AM"
  dropPoint: string;
  dropTime: string;            // "07:30 AM"
  routeId: string;
  routeName?: string;
  stopId?: string;
  shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'CUSTOM';
  status: PassengerStatus;
  rfidCardNumber?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  id: string;
  routeId: string;
  sequence: number;
  stopName: string;
  landmark?: string;
  address?: string;
  latitude: number;
  longitude: number;
  scheduledTime: string;       // e.g. "06:30"
  departureTime?: string;      // e.g. "06:35"
  stopType?: 'PICKUP' | 'DROP' | 'BOTH';
  geofenceRadiusMeters?: number;
  passengerCount: number;
  notes?: string;
}

export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Route {
  id: string;
  routeName: string;
  routeCode: string;           // e.g. "RT-DXB-04"
  description: string;
  origin: string;              // e.g. "Al Quoz Accommodation Zone 3"
  destination: string;         // e.g. "Dubai Airport Terminal 3 Freight Gate"
  distanceKm: number;
  estimatedDurationMinutes: number;
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  clientId?: string;
  clientCompanyName?: string;
  shift?: 'MORNING' | 'EVENING' | 'NIGHT' | 'CUSTOM';
  status: RouteStatus;
  stops: RouteStop[];
  operatingDays: ('SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT')[];
  morningDepartureTime: string; // e.g. "06:00"
  eveningReturnTime: string;    // e.g. "18:00"
  assignedPassengerIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TripStatus = 'SCHEDULED' | 'BOARDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';

export interface Trip {
  id: string;
  tripNumber: string;          // e.g. "TRIP-2026-0819"
  routeId: string;
  routeName: string;
  clientId?: string;
  clientCompanyName?: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  scheduledDate: string;       // "2026-08-20"
  scheduledStartTime: string;  // "06:00"
  scheduledEndTime: string;    // "07:30"
  actualStartTime?: string;
  actualEndTime?: string;
  status: TripStatus;
  passengerCount: number;
  boardedPassengerCount: number;
  currentStopIndex?: number;
  delayMinutes: number;
  delayReason?: string;
  cancellationReason?: string;
  shift?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  notes?: string;
  passengerManifest?: {
    id: string;
    employeeId: string;
    name: string;
    pickupPoint: string;
    dropPoint: string;
    boarded: boolean;
    boardedAt?: string;
    rfidCardNumber?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleLocation {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId?: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  headingDegrees: number;
  engineStatus: 'ON' | 'IDLE' | 'OFF';
  fuelLevelPercent: number;
  acStatus: 'ON' | 'OFF';
  timestamp: string;
  lastUpdatedText: string;
}

export type MaintenanceServiceType =
  | 'PREVENTIVE'
  | 'OIL_CHANGE'
  | 'TIRE_SERVICE'
  | 'BRAKE_SERVICE'
  | 'INSPECTION'
  | 'AC_OVERHAUL'
  | 'REPAIR'
  | 'EMERGENCY_REPAIR'
  | 'SCHEDULED_SERVICE'
  | 'RTA_INSPECTION';

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  serviceType: MaintenanceServiceType;
  description: string;
  priority: MaintenancePriority;
  date: string;
  scheduledDate?: string;
  completedDate?: string;
  costAed: number;
  mileageKm: number;
  nextServiceDate?: string;
  nextServiceMileageKm?: number;
  workshopName: string;        // e.g. "Al Habtoor Fleet Workshop, Al Quoz"
  vendor?: string;             // Alias for workshop/vendor
  technicianName?: string;
  invoiceNumber?: string;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DocumentType =
  | 'DRIVER_LICENSE'
  | 'VEHICLE_REGISTRATION'
  | 'INSURANCE_POLICY'
  | 'RTA_PERMIT'
  | 'MUNICIPALITY_PERMIT'
  | 'EMIRATES_ID'
  | 'VISA'
  | 'MEDICAL_FITNESS'
  | 'TRADE_LICENSE'
  | 'CONTRACT'
  | 'INSPECTION_CERT'
  | 'MULKIYA_REGISTRATION'
  | 'COMMERCIAL_INSURANCE'
  | 'RTA_DRIVER_PERMIT'
  | 'HEAVY_BUS_LICENSE'
  | 'POLICE_CLEARANCE'
  | 'EMISSION_CERTIFICATE'
  | 'OTHER';

export type DocumentOwnerType = 'VEHICLE' | 'DRIVER' | 'CLIENT' | 'COMPANY' | 'CORPORATE';
export type DocumentEntityType = 'VEHICLE' | 'DRIVER' | 'CORPORATE' | 'CLIENT' | 'SYSTEM';
export type DocumentStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_RENEWAL';

export interface DocumentRecord {
  id: string;
  name?: string;
  title?: string;
  documentNumber: string;
  type?: DocumentType;
  documentType?: DocumentType;
  ownerType?: DocumentOwnerType;
  entityType?: DocumentEntityType;
  ownerId?: string;
  entityId?: string;
  ownerName?: string;
  entityName?: string;
  relatedEntityId?: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;    // e.g. "RTA Dubai", "Dubai Police", "Oman Insurance", "Tasjeel"
  fileReference?: string;
  fileUrl?: string;
  status: DocumentStatus;
  daysRemaining?: number;
  daysUntilExpiry?: number;
  notes?: string;
  fileSizeMb?: number;
  createdAt: string;
  updatedAt?: string;
}

export type NotificationType =
  | 'OPERATIONAL'
  | 'MAINTENANCE'
  | 'COMPLIANCE'
  | 'SCHEDULING'
  | 'SCHEDULE'
  | 'TRIP'
  | 'SYSTEM'
  | 'ALERT'
  | 'TRIP_UPDATE'
  | 'MAINTENANCE_REMINDER'
  | 'DOCUMENT_EXPIRY'
  | 'SECURITY';

export type NotificationCategory = NotificationType;

export type NotificationPriority = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY' | 'WARNING';

export interface NotificationRecord {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  read?: boolean;
  isRead?: boolean;
  archived?: boolean;
  priority: NotificationPriority;
  targetRole?: string;
  actionUrl?: string;
  timestamp?: string;
  relatedEntityType?: 'VEHICLE' | 'DRIVER' | 'TRIP' | 'ROUTE' | 'DOCUMENT' | 'INQUIRY';
  relatedEntityId?: string;
  createdAt: string;
}

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'PROPOSAL_SENT' | 'QUOTED' | 'WON' | 'ARCHIVED';

export interface InquiryRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  requiredVehiclesCount: number;
  estimatedPassengers: number;
  serviceType: 'DAILY_STAFF_COMMUTE' | 'EXECUTIVE_SHUTTLE' | 'SITE_PROJECT_TRANSPORT' | 'EVENT_TRANSFER' | 'CUSTOM_FLEET';
  routeDetails?: string;
  message: string;
  status: InquiryStatus;
  source: 'WEBSITE_CONTACT' | 'REQUEST_QUOTE_MODAL' | 'PHONE_LEAD' | 'DIRECT';
  notes?: string;
  createdAt: string;
}

export interface SalikTransaction {
  id: string;
  tollGateName: string;         // e.g. "Al Barsha Toll Gate", "Al Safa", "Al Garhoud", "Airport Tunnel"
  tollGateCode: string;         // e.g. "GT-BARSHA-01"
  corridor: string;             // e.g. "Sheikh Zayed Road (E11)"
  vehicleId: string;
  vehicleNumber: string;
  driverId?: string;
  driverName?: string;
  tripId?: string;
  routeId?: string;
  routeName?: string;
  clientId?: string;
  clientCompanyName?: string;
  amountAed: number;            // Fixed Dubai Salik toll (4 AED)
  tagNumber: string;
  timestamp: string;
  isSimulated: boolean;
}

export type DateRangePreset = 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM';

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate: string;            // YYYY-MM-DD
  endDate: string;              // YYYY-MM-DD
  label: string;
}

export interface ReportsFilterParams {
  preset?: DateRangePreset;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  routeId?: string;
  vehicleId?: string;
  driverId?: string;
  shift?: string;
  status?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  summary?: any;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp?: string;
    dateRange?: {
      preset: string;
      startDate: string;
      endDate: string;
    };
  };
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

