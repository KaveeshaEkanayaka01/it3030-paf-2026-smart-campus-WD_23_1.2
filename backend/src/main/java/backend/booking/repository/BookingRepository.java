package backend.booking.repository;

import backend.booking.entity.Booking;
import backend.booking.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Find all bookings by a specific user
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    // Find all bookings for a resource (for calendar view)
    List<Booking> findByResourceIdOrderByStartTimeAsc(String resourceId);

    // Find all bookings ordered by creation date
    List<Booking> findAllByOrderByCreatedAtDesc();

    /**
     * CONFLICT DETECTION ALGORITHM for MongoDB
     * Checks for overlapping time slots on the same resource with APPROVED status.
     * Condition: existing.startTime < newEndTime AND existing.endTime > newStartTime
     * An optional excludeId allows skipping the current booking when re-checking on approval.
     */
    @Query("{ 'resourceId': ?0, 'status': 'APPROVED', 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 }, $or: [ { '_id': { $ne: ?3 } }, { '_id': null } ] }")
    List<Booking> findConflictingBookings(String resourceId, Date startTime, Date endTime, String excludeId);

    // Count pending bookings (for admin dashboard badge)
    long countByStatus(BookingStatus status);
}
