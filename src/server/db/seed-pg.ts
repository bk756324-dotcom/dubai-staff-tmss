import { withTransaction, getPool } from './pool.js';
import {
  SEED_USERS,
  SEED_VEHICLES,
  SEED_DRIVERS,
  SEED_CLIENTS,
  SEED_PASSENGERS,
  SEED_ROUTES,
  SEED_TRIPS,
  SEED_LOCATIONS,
  SEED_MAINTENANCE,
  SEED_DOCUMENTS,
  SEED_NOTIFICATIONS,
  SEED_INQUIRIES,
  SEED_SALIK_TRANSACTIONS,
} from './seeds.js';

export async function seedPostgres(): Promise<{ success: boolean; counts: Record<string, number>; error?: string }> {
  const pool = getPool();
  if (!pool) {
    return { success: false, counts: {}, error: 'DATABASE_URL is not configured' };
  }

  try {
    const counts: Record<string, number> = {};

    await withTransaction(async (client) => {
      // 1. System Metadata
      await client.query(
        `INSERT INTO system_meta (key, value, updated_at) 
         VALUES ($1, $2, NOW()) 
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        ['system_info', JSON.stringify({ version: '1.0.0', seedVersion: '2026-Q3-PROMPT-9-PG', initializedAt: new Date().toISOString() })]
      );

      // 2. Users
      for (const u of SEED_USERS) {
        await client.query(
          `INSERT INTO users (id, name, email, phone, role, status, avatar_url, department, company_id, client_id, driver_id, password_hash, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             email = EXCLUDED.email,
             phone = EXCLUDED.phone,
             role = EXCLUDED.role,
             status = EXCLUDED.status,
             avatar_url = EXCLUDED.avatar_url,
             department = EXCLUDED.department,
             password_hash = EXCLUDED.password_hash,
             updated_at = NOW()`,
          [
            u.id,
            u.name,
            u.email,
            u.phone,
            u.role,
            u.status,
            u.avatarUrl || null,
            u.department || null,
            u.companyId || null,
            u.clientId || u.companyId || null,
            u.driverId || null,
            u.passwordHash,
            u.createdAt || new Date().toISOString(),
            u.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.users = SEED_USERS.length;

      // 3. Clients
      for (const c of SEED_CLIENTS) {
        await client.query(
          `INSERT INTO clients (id, company_name, industry, trade_license_number, contact_person, contact_title, email, phone, office_location, contract_start_date, contract_end_date, contract_value_aed, payment_terms, billing_cycle, status, active_routes_count, total_passengers_count, assigned_vehicles_count, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
           ON CONFLICT (id) DO UPDATE SET
             company_name = EXCLUDED.company_name,
             contact_person = EXCLUDED.contact_person,
             phone = EXCLUDED.phone,
             email = EXCLUDED.email,
             status = EXCLUDED.status,
             contract_value_aed = EXCLUDED.contract_value_aed,
             updated_at = NOW()`,
          [
            c.id,
            c.companyName,
            c.industry,
            c.tradeLicenseNumber,
            c.contactPerson,
            c.contactTitle || 'Operations Representative',
            c.email,
            c.phone,
            c.officeLocation || 'Dubai, UAE',
            c.contractStartDate,
            c.contractEndDate,
            c.contractValueAed || 0,
            c.paymentTerms || 'Net 30 Days',
            c.billingCycle || 'MONTHLY',
            c.status,
            c.activeRoutesCount || 0,
            c.totalPassengersCount || 0,
            c.assignedVehiclesCount || 0,
            c.createdAt || new Date().toISOString(),
            c.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.clients = SEED_CLIENTS.length;

      // 4. Vehicles
      for (const v of SEED_VEHICLES) {
        await client.query(
          `INSERT INTO vehicles (id, vehicle_number, registration_number, plate_category, vehicle_type, make, model, year, capacity, status, assigned_driver_id, assigned_driver_name, current_route_id, current_route_name, insurance_expiry, registration_expiry, rta_permit_expiry, next_maintenance_date, current_mileage_km, fuel_type, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
           ON CONFLICT (id) DO UPDATE SET
             status = EXCLUDED.status,
             assigned_driver_id = EXCLUDED.assigned_driver_id,
             assigned_driver_name = EXCLUDED.assigned_driver_name,
             current_route_id = EXCLUDED.current_route_id,
             current_route_name = EXCLUDED.current_route_name,
             current_mileage_km = EXCLUDED.current_mileage_km,
             updated_at = NOW()`,
          [
            v.id,
            v.vehicleNumber,
            v.registrationNumber,
            v.plateCategory,
            v.vehicleType,
            v.make,
            v.model,
            v.year,
            v.capacity,
            v.status,
            v.assignedDriverId || null,
            v.assignedDriverName || null,
            v.currentRouteId || null,
            v.currentRouteName || null,
            v.insuranceExpiry,
            v.registrationExpiry,
            v.rtaPermitExpiry,
            v.nextMaintenanceDate,
            v.currentMileageKm || 0,
            v.fuelType || 'DIESEL',
            v.createdAt || new Date().toISOString(),
            v.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.vehicles = SEED_VEHICLES.length;

      // 5. Drivers
      for (const d of SEED_DRIVERS) {
        await client.query(
          `INSERT INTO drivers (id, employee_id, name, phone, email, license_number, license_category, license_expiry, rta_card_number, rta_card_expiry, visa_expiry, medical_fitness_expiry, status, assigned_vehicle_id, assigned_vehicle_number, assigned_route_id, assigned_route_name, joining_date, emergency_contact, total_trips_completed, safety_rating, rating, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             phone = EXCLUDED.phone,
             status = EXCLUDED.status,
             assigned_vehicle_id = EXCLUDED.assigned_vehicle_id,
             assigned_vehicle_number = EXCLUDED.assigned_vehicle_number,
             safety_rating = EXCLUDED.safety_rating,
             total_trips_completed = EXCLUDED.total_trips_completed,
             updated_at = NOW()`,
          [
            d.id,
            d.employeeId,
            d.name,
            d.phone,
            d.email,
            d.licenseNumber,
            d.licenseCategory,
            d.licenseExpiry,
            d.rtaCardNumber,
            d.rtaCardExpiry,
            d.visaExpiry || null,
            d.medicalFitnessExpiry || null,
            d.status,
            d.assignedVehicleId || null,
            d.assignedVehicleNumber || null,
            d.assignedRouteId || null,
            d.assignedRouteName || null,
            d.joiningDate || null,
            JSON.stringify(d.emergencyContact || {}),
            d.totalTripsCompleted || 0,
            d.safetyRating || 5.0,
            d.rating || d.safetyRating || 5.0,
            d.createdAt || new Date().toISOString(),
            d.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.drivers = SEED_DRIVERS.length;

      // 6. Routes
      for (const r of SEED_ROUTES) {
        await client.query(
          `INSERT INTO routes (id, route_name, route_code, description, origin, destination, distance_km, estimated_duration_minutes, assigned_vehicle_id, assigned_vehicle_number, assigned_driver_id, assigned_driver_name, client_id, client_company_name, shift, status, stops, operating_days, morning_departure_time, evening_return_time, assigned_passenger_ids, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
           ON CONFLICT (id) DO UPDATE SET
             route_name = EXCLUDED.route_name,
             stops = EXCLUDED.stops,
             distance_km = EXCLUDED.distance_km,
             estimated_duration_minutes = EXCLUDED.estimated_duration_minutes,
             status = EXCLUDED.status,
             updated_at = NOW()`,
          [
            r.id,
            r.routeName,
            r.routeCode,
            r.description || '',
            r.origin,
            r.destination,
            r.distanceKm,
            r.estimatedDurationMinutes,
            r.assignedVehicleId || null,
            r.assignedVehicleNumber || null,
            r.assignedDriverId || null,
            r.assignedDriverName || null,
            r.clientId || null,
            r.clientCompanyName || null,
            r.shift || 'MORNING',
            r.status,
            JSON.stringify(r.stops || []),
            JSON.stringify(r.operatingDays || ['MON', 'TUE', 'WED', 'THU', 'FRI']),
            r.morningDepartureTime || '06:00',
            r.eveningReturnTime || '18:00',
            JSON.stringify(r.assignedPassengerIds || []),
            r.createdAt || new Date().toISOString(),
            r.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.routes = SEED_ROUTES.length;

      // 7. Passengers
      for (const p of SEED_PASSENGERS) {
        await client.query(
          `INSERT INTO passengers (id, employee_id, name, phone, email, client_id, client_company_name, department, pickup_point, pickup_time, drop_point, drop_time, route_id, route_name, stop_id, shift, status, rfid_card_number, emergency_contact, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             phone = EXCLUDED.phone,
             route_id = EXCLUDED.route_id,
             route_name = EXCLUDED.route_name,
             status = EXCLUDED.status,
             updated_at = NOW()`,
          [
            p.id,
            p.employeeId,
            p.name,
            p.phone,
            p.email || null,
            p.clientId,
            p.clientCompanyName || null,
            p.department || null,
            p.pickupPoint,
            p.pickupTime,
            p.dropPoint,
            p.dropTime,
            p.routeId,
            p.routeName || null,
            p.stopId || null,
            p.shift || 'MORNING',
            p.status,
            p.rfidCardNumber || null,
            p.emergencyContact || null,
            p.createdAt || new Date().toISOString(),
            p.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.passengers = SEED_PASSENGERS.length;

      // 8. Trips
      for (const t of SEED_TRIPS) {
        await client.query(
          `INSERT INTO trips (id, trip_number, route_id, route_name, client_id, client_company_name, vehicle_id, vehicle_number, driver_id, driver_name, driver_phone, scheduled_date, scheduled_start_time, scheduled_end_time, actual_start_time, actual_end_time, status, passenger_count, boarded_passenger_count, current_stop_index, delay_minutes, delay_reason, cancellation_reason, shift, notes, passenger_manifest, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
           ON CONFLICT (id) DO UPDATE SET
             status = EXCLUDED.status,
             vehicle_id = EXCLUDED.vehicle_id,
             vehicle_number = EXCLUDED.vehicle_number,
             driver_id = EXCLUDED.driver_id,
             driver_name = EXCLUDED.driver_name,
             boarded_passenger_count = EXCLUDED.boarded_passenger_count,
             delay_minutes = EXCLUDED.delay_minutes,
             updated_at = NOW()`,
          [
            t.id,
            t.tripNumber,
            t.routeId,
            t.routeName,
            t.clientId || null,
            t.clientCompanyName || null,
            t.vehicleId,
            t.vehicleNumber,
            t.driverId,
            t.driverName,
            t.driverPhone,
            t.scheduledDate,
            t.scheduledStartTime,
            t.scheduledEndTime,
            t.actualStartTime || null,
            t.actualEndTime || null,
            t.status,
            t.passengerCount || 0,
            t.boardedPassengerCount || 0,
            t.currentStopIndex || 0,
            t.delayMinutes || 0,
            t.delayReason || null,
            t.cancellationReason || null,
            t.shift || 'MORNING',
            t.notes || null,
            JSON.stringify(t.passengerManifest || []),
            t.createdAt || new Date().toISOString(),
            t.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.trips = SEED_TRIPS.length;

      // 9. Locations
      for (const loc of SEED_LOCATIONS) {
        await client.query(
          `INSERT INTO locations (id, vehicle_id, vehicle_number, driver_id, trip_id, latitude, longitude, speed_kmh, heading_degrees, engine_status, fuel_level_percent, ac_status, timestamp, last_updated_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO UPDATE SET
             latitude = EXCLUDED.latitude,
             longitude = EXCLUDED.longitude,
             speed_kmh = EXCLUDED.speed_kmh,
             heading_degrees = EXCLUDED.heading_degrees,
             engine_status = EXCLUDED.engine_status,
             fuel_level_percent = EXCLUDED.fuel_level_percent,
             ac_status = EXCLUDED.ac_status,
             timestamp = EXCLUDED.timestamp,
             last_updated_text = EXCLUDED.last_updated_text`,
          [
            loc.id,
            loc.vehicleId,
            loc.vehicleNumber,
            loc.driverId || null,
            loc.tripId || null,
            loc.latitude,
            loc.longitude,
            loc.speedKmh || 0,
            loc.headingDegrees || 0,
            loc.engineStatus || 'ON',
            loc.fuelLevelPercent || 80,
            loc.acStatus || 'ON',
            loc.timestamp || new Date().toISOString(),
            loc.lastUpdatedText || 'Just now',
          ]
        );
      }
      counts.locations = SEED_LOCATIONS.length;

      // 10. Maintenance
      for (const m of SEED_MAINTENANCE) {
        await client.query(
          `INSERT INTO maintenance (id, vehicle_id, vehicle_number, service_type, description, priority, date, scheduled_date, completed_date, cost_aed, mileage_km, next_service_date, next_service_mileage_km, workshop_name, vendor, technician_name, invoice_number, status, notes, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
           ON CONFLICT (id) DO UPDATE SET
             status = EXCLUDED.status,
             completed_date = EXCLUDED.completed_date,
             cost_aed = EXCLUDED.cost_aed,
             updated_at = NOW()`,
          [
            m.id,
            m.vehicleId,
            m.vehicleNumber,
            m.serviceType,
            m.description,
            m.priority || 'MEDIUM',
            m.date,
            m.scheduledDate || null,
            m.completedDate || null,
            m.costAed || 0,
            m.mileageKm || 0,
            m.nextServiceDate || null,
            m.nextServiceMileageKm || null,
            m.workshopName,
            m.vendor || m.workshopName,
            m.technicianName || null,
            m.invoiceNumber || null,
            m.status,
            m.notes || null,
            m.createdAt || new Date().toISOString(),
            m.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.maintenance = SEED_MAINTENANCE.length;

      // 11. Documents
      for (const doc of SEED_DOCUMENTS) {
        await client.query(
          `INSERT INTO documents (id, name, title, document_number, type, document_type, owner_type, entity_type, owner_id, entity_id, owner_name, entity_name, related_entity_id, issue_date, expiry_date, issuing_authority, file_reference, file_url, status, days_remaining, days_until_expiry, notes, file_size_mb, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
           ON CONFLICT (id) DO UPDATE SET
             status = EXCLUDED.status,
             expiry_date = EXCLUDED.expiry_date,
             days_remaining = EXCLUDED.days_remaining,
             updated_at = NOW()`,
          [
            doc.id,
            doc.name || doc.title || 'Document Record',
            doc.title || doc.name || 'Document Record',
            doc.documentNumber,
            doc.type || doc.documentType || 'OTHER',
            doc.documentType || doc.type || 'OTHER',
            doc.ownerType || 'VEHICLE',
            doc.entityType || 'VEHICLE',
            doc.ownerId || doc.entityId || null,
            doc.entityId || doc.ownerId || null,
            doc.ownerName || doc.entityName || null,
            doc.entityName || doc.ownerName || null,
            doc.relatedEntityId || null,
            doc.issueDate,
            doc.expiryDate,
            doc.issuingAuthority,
            doc.fileReference || null,
            doc.fileUrl || null,
            doc.status,
            doc.daysRemaining || doc.daysUntilExpiry || null,
            doc.daysUntilExpiry || doc.daysRemaining || null,
            doc.notes || null,
            doc.fileSizeMb || null,
            doc.createdAt || new Date().toISOString(),
            doc.updatedAt || new Date().toISOString(),
          ]
        );
      }
      counts.documents = SEED_DOCUMENTS.length;

      // 12. Notifications
      for (const n of SEED_NOTIFICATIONS) {
        await client.query(
          `INSERT INTO notifications (id, user_id, title, message, type, category, read, is_read, archived, priority, target_role, action_url, timestamp, related_entity_type, related_entity_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO UPDATE SET
             is_read = EXCLUDED.is_read,
             read = EXCLUDED.read`,
          [
            n.id,
            n.userId || null,
            n.title,
            n.message,
            n.type || n.category || 'OPERATIONAL',
            n.category || n.type || 'OPERATIONAL',
            n.read || n.isRead || false,
            n.isRead || n.read || false,
            n.archived || false,
            n.priority || 'MEDIUM',
            n.targetRole || 'ADMIN',
            n.actionUrl || null,
            n.timestamp || n.createdAt || new Date().toISOString(),
            n.relatedEntityType || null,
            n.relatedEntityId || null,
            n.createdAt || new Date().toISOString(),
          ]
        );
      }
      counts.notifications = SEED_NOTIFICATIONS.length;

      // 13. Inquiries
      for (const inq of SEED_INQUIRIES) {
        await client.query(
          `INSERT INTO inquiries (id, name, company, email, phone, industry, required_vehicles_count, estimated_passengers, service_type, route_details, message, status, source, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT (id) DO UPDATE SET
             status = EXCLUDED.status,
             notes = EXCLUDED.notes`,
          [
            inq.id,
            inq.name,
            inq.company,
            inq.email,
            inq.phone,
            inq.industry || 'Corporate Commercial',
            inq.requiredVehiclesCount || 1,
            inq.estimatedPassengers || 30,
            inq.serviceType || 'DAILY_STAFF_COMMUTE',
            inq.routeDetails || null,
            inq.message,
            inq.status,
            inq.source || 'WEBSITE_CONTACT',
            inq.notes || null,
            inq.createdAt || new Date().toISOString(),
          ]
        );
      }
      counts.inquiries = SEED_INQUIRIES.length;

      // 14. Salik Transactions
      for (const s of SEED_SALIK_TRANSACTIONS) {
        await client.query(
          `INSERT INTO salik_transactions (id, toll_gate_name, toll_gate_code, corridor, vehicle_id, vehicle_number, driver_id, driver_name, trip_id, route_id, route_name, client_id, client_company_name, amount_aed, tag_number, timestamp, is_simulated)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
           ON CONFLICT (id) DO NOTHING`,
          [
            s.id,
            s.tollGateName,
            s.tollGateCode,
            s.corridor,
            s.vehicleId,
            s.vehicleNumber,
            s.driverId || null,
            s.driverName || null,
            s.tripId || null,
            s.routeId || null,
            s.routeName || null,
            s.clientId || null,
            s.clientCompanyName || null,
            s.amountAed || 4.0,
            s.tagNumber,
            s.timestamp,
            s.isSimulated ?? true,
          ]
        );
      }
      counts.salikTransactions = SEED_SALIK_TRANSACTIONS.length;
    });

    console.log('[PostgreSQL Seed] Successfully seeded all 13 domains into PostgreSQL:', counts);
    return { success: true, counts };
  } catch (err: any) {
    console.error('[PostgreSQL Seed Error]', err.message);
    return { success: false, counts: {}, error: err.message };
  }
}
