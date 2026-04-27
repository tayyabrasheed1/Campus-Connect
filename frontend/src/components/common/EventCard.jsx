const EventCard = ({ event, compact = false, actionMode = "register", onAction, onTicket }) => {
  const isDetailsMode = actionMode === "details";

  if (compact) {
    return (
      <article className="mini-event">
        <div className="event-image" style={{ backgroundImage: `url(${event.image})` }} />
        <div className="mini-event-body">
          <h4>{event.title}</h4>
          <p>{event.date}</p>
          <button type="button" onClick={() => onTicket?.(event)}>
            View QR Ticket
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="event-item">
      <div className="event-image" style={{ backgroundImage: `url(${event.image})` }} />
      <div className="event-item-body">
        <div className="event-row">
          <h4>{event.title}</h4>
          <span className="chip chip-muted">{event.tag}</span>
        </div>
        <p>{event.subtitle}</p>
        <p>{event.date}</p>
        <p>{event.location}</p>
        <div className="event-row">
          <button type="button" disabled={!isDetailsMode && event.status === "registered"} onClick={() => onAction?.(event)}>
            {isDetailsMode ? "View Details" : event.status === "registered" ? "Registered" : "Register"}
          </button>
          <span className="muted">{event.attendees}</span>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
