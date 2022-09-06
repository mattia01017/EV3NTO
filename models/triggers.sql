-- Incremento numero partecipanti
CREATE OR REPLACE FUNCTION INCREMENT_NUM_PAR() RETURNS TRIGGER AS
$$  BEGIN
        UPDATE events 
        SET num_part = num_part + 1
        WHERE events.id = new.p_event;
        RETURN NULL;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER SUBSCRIPTION
AFTER INSERT ON partecipations
FOR EACH ROW
EXECUTE PROCEDURE INCREMENT_NUM_PAR();

-- decremento numero partecipanti
CREATE OR REPLACE FUNCTION DECREMENT_NUM_PAR() RETURNS TRIGGER AS
$$  BEGIN
        UPDATE events 
        SET num_part = num_part - 1
        WHERE events.id = old.p_event;
        RETURN NULL;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER DESUBSCRIPTION
AFTER DELETE ON partecipations
FOR EACH ROW
EXECUTE PROCEDURE DECREMENT_NUM_PAR();

-- crea nuovo id evento se l'id generato è già presente
CREATE OR REPLACE FUNCTION REPEAT_EVENT_INSERT() RETURNS TRIGGER AS
$$  DECLARE
        new_id events.id%TYPE;
    BEGIN
        new_id := NEW.id;
        LOOP
            PERFORM E.id
            FROM events as E
            WHERE E.id = new_id;
            IF NOT FOUND THEN
                NEW.id = new_id;
                RETURN NEW;
            ELSE
                new_id := SUBSTR(MD5(RANDOM()::TEXT), 0, 11);
            END IF;
        END LOOP;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER EV_INSERT
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE PROCEDURE REPEAT_EVENT_INSERT();    