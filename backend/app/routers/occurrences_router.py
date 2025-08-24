from fastapi import APIRouter, HTTPException
from typing import List
from ..database import supabase_client
from ..schemas.occurrence_response import OccurrenceResponse, OccurrencesListResponse
import struct

router = APIRouter(prefix="/occurrences", tags=["Occurrences"])


def parse_geography_coordinates(coord_hex: str) -> tuple[float, float]:
    """
    Parse PostGIS geography coordinates from hex string like '0101000020E6100000180000A0CC5447C096FFFFFF859A37C0'
    Returns (latitude, longitude) tuple
    """
    try:
        # Convert hex string to bytes
        coord_bytes = bytes.fromhex(coord_hex)
        
        # Skip the first 5 bytes (endianness, geometry type, SRID)
        # WKB format: endianness(1) + geometry_type(4) + SRID(4) + coordinates...
        coord_data = coord_bytes[9:]
        
        # Parse the coordinates (double precision, 8 bytes each)
        if len(coord_data) >= 16:  # At least 2 doubles (8 bytes each)
            lng = struct.unpack('d', coord_data[:8])[0]
            lat = struct.unpack('d', coord_data[8:16])[0]
            return lat, lng
        else:
            raise ValueError(f"Invalid coordinate data length: {len(coord_data)}")
            
    except Exception as e:
        print(f"Error parsing coordinates {coord_hex}: {e}")
        return 0.0, 0.0


@router.get(
    "/",
    operation_id="get_occurrences",
    summary="Get all occurrences",
    description="Retrieve all occurrences from the database with their details.",
    response_model=OccurrencesListResponse
)
def get_occurrences():
    try:
        # Query all occurrences from the occurrences table
        response = (
            supabase_client.table("occurrences")
            .select("*")
            .execute()
        )
        
        if response.data is None:
            return OccurrencesListResponse(occurrences=[], total_count=0)
        
        # Transform the data to match our response schema
        occurrences = []
        for occurrence in response.data:
            # Parse the geography coordinates
            coordinates = occurrence.get("coordinates", "")
            lat, lng = parse_geography_coordinates(coordinates)
            
            # Convert timestamp to date string
            timestamp = occurrence.get("timestamp", "")
            date_str = ""
            if timestamp:
                try:
                    # Parse timestamp and format as YYYY-MM-DD
                    from datetime import datetime
                    if isinstance(timestamp, str):
                        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    else:
                        dt = timestamp
                    date_str = dt.strftime("%Y-%m-%d")
                except Exception as e:
                    print(f"Error parsing timestamp {timestamp}: {e}")
                    date_str = "2025-01-01"  # fallback date
            
            occurrence_response = OccurrenceResponse(
                id=str(occurrence.get("uuid", "")),
                lat=lat,
                lng=lng,
                date=date_str
            )
            occurrences.append(occurrence_response)
        
        print(occurrences, flush=True)
        return OccurrencesListResponse(
            occurrences=occurrences,
            total_count=len(occurrences)
        )
        
    except Exception as e:
        print(f"Error fetching occurrences: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while fetching occurrences"
        )


@router.get(
    "/{occurrence_id}",
    operation_id="get_occurrence_by_id",
    summary="Get occurrence by ID",
    description="Retrieve a specific occurrence by its ID.",
    response_model=OccurrenceResponse
)
def get_occurrence_by_id(occurrence_id: str):
    try:
        response = (
            supabase_client.table("occurrences")
            .select("*")
            .eq("uuid", occurrence_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail=f"Occurrence with ID {occurrence_id} not found"
            )
        
        occurrence = response.data[0]
        
        # Parse the geography coordinates
        coordinates = occurrence.get("coordinates", "")
        lat, lng = parse_geography_coordinates(coordinates)
        
        # Convert timestamp to date string
        timestamp = occurrence.get("timestamp", "")
        date_str = ""
        if timestamp:
            try:
                from datetime import datetime
                if isinstance(timestamp, str):
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                else:
                    dt = timestamp
                date_str = dt.strftime("%Y-%m-%d")
            except Exception as e:
                print(f"Error parsing timestamp {timestamp}: {e}")
                date_str = "2025-01-01"
        
        return OccurrenceResponse(
            id=str(occurrence.get("uuid", "")),
            lat=lat,
            lng=lng,
            date=date_str
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching occurrence {occurrence_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while fetching occurrence"
        ) 