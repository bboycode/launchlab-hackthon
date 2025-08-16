# Some sources:
# https://composio.dev/blog/mcp-server-step-by-step-guide-to-building-from-scrtch
# https://medium.com/data-engineering-with-dremio/building-a-basic-mcp-server-with-python-4c34c41031ed
# https://www.solo.io/blog/understanding-mcp-authorization-step-by-step-part-one
# https://gofastmcp.com/tutorials/create-mcp-server

# # basic import 
# import os
# import math
# from fastmcp import FastMCP
# from supabase import create_client, Client

# url: str = os.environ.get("SUPABASE_URL")
# key: str = os.environ.get("SUPABASE_ANON_KEY")
# supabase: Client = create_client(url, key)

# # instantiate an MCP server client
# mcp = FastMCP("MCP_Server")

# # Configure the server to run on all interfaces for Docker
# def run_server(transport="stdio", host="localhost", port=8008):
#     """Run the MCP server with configurable transport"""
#     mcp.run(transport=transport, host=host, port=port)

# #  division tool
# @mcp.tool() 
# def request_stat(q: str) -> str:
    

 
# # execute and return the stdio output
# if __name__ == "__main__":
#     print("Starting MCP server...")
#     run_server(transport="streamable-http", host="localhost", port=8008)

# Some sources:
# https://composio.dev/blog/mcp-server-step-by-step-guide-to-building-from-scrtch
# https://medium.com/data-engineering-with-dremio/building-a-basic-mcp-server-with-python-4c34c41031ed
# https://www.solo.io/blog/understanding-mcp-authorization-step-by-step-part-one
# https://gofastmcp.com/tutorials/create-mcp-server

# basic import 
import os
import json
from typing import List, Dict, Any
from fastmcp import FastMCP
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")  # Using SUPABASE_KEY from your .env
supabase: Client = create_client(url, key)

# instantiate an MCP server client
mcp = FastMCP("MCP_Server")

# Configure the server to run on all interfaces for Docker
def run_server(transport="stdio", host="localhost", port=8008):
    """Run the MCP server with configurable transport"""
    mcp.run(transport=transport, host=host, port=port)

@mcp.tool()
def get_clinical_notes(doctor_id: str = None, patient_name: str = None, limit: int = 10) -> str:
    """
    Retrieve clinical notes from Supabase database.
    
    Args:
        doctor_id: Filter by doctor ID (optional)
        patient_name: Filter by patient name (optional)  
        limit: Maximum number of records to return (default 10)
    
    Returns:
        JSON string containing clinical notes data
    """
    try:
        query = supabase.table('clinical_notes').select('*')
        
        if doctor_id:
            query = query.eq('doctor_id', doctor_id)
        if patient_name:
            query = query.ilike('patient_name', f'%{patient_name}%')
            
        result = query.limit(limit).execute()
        
        if result.data:
            return json.dumps({
                "success": True,
                "count": len(result.data),
                "data": result.data
            }, indent=2)
        else:
            return json.dumps({"success": True, "count": 0, "message": "No clinical notes found"})
            
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def get_patient_info(patient_id: str = None, medical_record_number: str = None) -> str:
    """
    Retrieve patient information from Supabase database.
    
    Args:
        patient_id: Patient ID to search for
        medical_record_number: Medical record number to search for
        
    Returns:
        JSON string containing patient data
    """
    try:
        query = supabase.table('patients').select('*')
        
        if patient_id:
            query = query.eq('id', patient_id)
        elif medical_record_number:
            query = query.eq('medical_record_number', medical_record_number)
        else:
            return json.dumps({"success": False, "error": "Either patient_id or medical_record_number is required"})
            
        result = query.execute()
        
        if result.data:
            return json.dumps({
                "success": True,
                "data": result.data[0] if len(result.data) == 1 else result.data
            }, indent=2)
        else:
            return json.dumps({"success": True, "message": "No patient found"})
            
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def search_database(table_name: str, column: str, search_term: str, limit: int = 5) -> str:
    """
    Search any table in the Supabase database.
    
    Args:
        table_name: Name of the table to search
        column: Column name to search in
        search_term: Term to search for
        limit: Maximum number of results (default 5)
        
    Returns:
        JSON string containing search results
    """
    try:
        query = supabase.table(table_name).select('*')
        query = query.ilike(column, f'%{search_term}%')
        result = query.limit(limit).execute()
        
        return json.dumps({
            "success": True,
            "table": table_name,
            "search_column": column,
            "search_term": search_term,
            "count": len(result.data),
            "data": result.data
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def get_doctor_info(doctor_id: str) -> str:
    """
    Retrieve doctor information from Supabase database.
    
    Args:
        doctor_id: Doctor ID to search for
        
    Returns:
        JSON string containing doctor data
    """
    try:
        result = supabase.table('doctors').select('*').eq('id', doctor_id).execute()
        
        if result.data:
            return json.dumps({
                "success": True,
                "data": result.data[0]
            }, indent=2)
        else:
            return json.dumps({"success": True, "message": "No doctor found"})
            
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def get_table_schema(table_name: str) -> str:
    """
    Get the schema/structure of a specific table.
    
    Args:
        table_name: Name of the table
        
    Returns:
        JSON string containing table schema information
    """
    try:
        # Get first row to understand structure
        result = supabase.table(table_name).select('*').limit(1).execute()
        
        if result.data:
            schema = {
                "table_name": table_name,
                "columns": list(result.data[0].keys()),
                "sample_data": result.data[0]
            }
            return json.dumps({"success": True, "schema": schema}, indent=2)
        else:
            return json.dumps({"success": True, "message": f"Table '{table_name}' is empty or doesn't exist"})
            
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def execute_custom_query(table_name: str, filters: str = None, columns: str = "*", limit: int = 10) -> str:
    """
    Execute a custom query on Supabase with flexible filters.
    
    Args:
        table_name: Name of the table to query
        filters: JSON string of filters (e.g., '{"column": "value", "column2": "value2"}')
        columns: Comma-separated list of columns to select (default: "*")
        limit: Maximum number of results (default 10)
        
    Returns:
        JSON string containing query results
    """
    try:
        query = supabase.table(table_name).select(columns)
        
        if filters:
            filter_dict = json.loads(filters)
            for column, value in filter_dict.items():
                query = query.eq(column, value)
                
        result = query.limit(limit).execute()
        
        return json.dumps({
            "success": True,
            "table": table_name,
            "filters": filters,
            "columns": columns,
            "count": len(result.data),
            "data": result.data
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def get_database_context() -> str:
    """
    Get comprehensive database context including all tables and their schemas.
    This helps Gemini understand the database structure before making queries.
    
    Returns:
        JSON string containing all tables and their column information
    """
    try:
        # Actual tables in your database
        tables = [
            'doctor_table',
            'patient_table',
            'clinical_notes'  # This might exist from your transcription uploads
        ]
        
        database_context = {
            "database_info": {
                "total_tables": len(tables),
                "available_tables": tables
            },
            "table_schemas": {
                "doctor_table": {
                    "columns": [
                        "id", "first_name", "last_name", "id_number", "email_address", 
                        "phone_number", "practice_number", "specialty", "hospital", 
                        "password", "created_at"
                    ],
                    "description": "Contains doctor information and credentials",
                    "searchable_fields": ["first_name", "last_name", "specialty", "hospital"],
                    "key_fields": {
                        "id": "Primary key",
                        "first_name": "Doctor's first name",
                        "last_name": "Doctor's last name", 
                        "specialty": "Medical specialty",
                        "hospital": "Hospital affiliation"
                    }
                },
                "patient_table": {
                    "columns": [
                        "id", "first_name", "last_name", "id_number", "dob", "sex", 
                        "language", "email_address", "phone_number", "emergency_contact_name",
                        "emergency_contact_phone", "med_aid_provider", "med_aid_number",
                        "primary_physician", "allergies", "med_conditions", "created_at"
                    ],
                    "description": "Contains patient demographic and medical information",
                    "searchable_fields": ["first_name", "last_name", "id_number", "allergies", "med_conditions"],
                    "key_fields": {
                        "id": "Primary key",
                        "first_name": "Patient's first name",
                        "last_name": "Patient's last name",
                        "dob": "Date of birth",
                        "primary_physician": "Assigned doctor",
                        "allergies": "Known allergies",
                        "med_conditions": "Medical conditions"
                    }
                }
            }
        }
        
        # Try to get actual data to confirm table structure
        for table in ["doctor_table", "patient_table"]:
            try:
                result = supabase.table(table).select('*').limit(1).execute()
                if result.data:
                    database_context["table_schemas"][table]["has_data"] = True
                    database_context["table_schemas"][table]["sample_data"] = "Available"
                else:
                    database_context["table_schemas"][table]["has_data"] = False
                    database_context["table_schemas"][table]["sample_data"] = "Empty"
            except Exception as table_error:
                database_context["table_schemas"][table]["error"] = str(table_error)
                database_context["table_schemas"][table]["accessible"] = False
        
        return json.dumps(database_context, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def search_doctors(search_term: str, search_field: str = "first_name", limit: int = 5) -> str:
    """
    Search for doctors in the doctor_table.
    
    Args:
        search_term: Term to search for
        search_field: Field to search in (first_name, last_name, specialty, hospital)
        limit: Maximum number of results
        
    Returns:
        JSON string containing doctor search results
    """
    try:
        valid_fields = ["first_name", "last_name", "specialty", "hospital", "practice_number"]
        
        if search_field not in valid_fields:
            return json.dumps({
                "success": False, 
                "error": f"Invalid search field. Valid fields: {valid_fields}"
            })
        
        query = supabase.table('doctor_table').select('*')
        query = query.ilike(search_field, f'%{search_term}%')
        result = query.limit(limit).execute()
        
        return json.dumps({
            "success": True,
            "table": "doctor_table",
            "search_field": search_field,
            "search_term": search_term,
            "count": len(result.data),
            "doctors": result.data
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def search_patients(search_term: str, search_field: str = "first_name", limit: int = 5) -> str:
    """
    Search for patients in the patient_table.
    
    Args:
        search_term: Term to search for
        search_field: Field to search in (first_name, last_name, id_number, allergies, med_conditions)
        limit: Maximum number of results
        
    Returns:
        JSON string containing patient search results
    """
    try:
        valid_fields = ["first_name", "last_name", "id_number", "allergies", "med_conditions", "primary_physician"]
        
        if search_field not in valid_fields:
            return json.dumps({
                "success": False, 
                "error": f"Invalid search field. Valid fields: {valid_fields}"
            })
        
        query = supabase.table('patient_table').select('*')
        query = query.ilike(search_field, f'%{search_term}%')
        result = query.limit(limit).execute()
        
        return json.dumps({
            "success": True,
            "table": "patient_table", 
            "search_field": search_field,
            "search_term": search_term,
            "count": len(result.data),
            "patients": result.data
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def get_table_relationships() -> str:
    """
    Get information about table relationships and foreign keys.
    
    Returns:
        JSON string containing relationship information
    """
    try:
        relationships = {
            "doctor_table": {
                "primary_key": "id",
                "foreign_keys": {},
                "referenced_by": ["patient_table.primary_physician", "clinical_notes.doctor_id (if exists)"],
                "description": "Doctor information and credentials",
                "common_queries": [
                    "Search by first_name or last_name to find doctors",
                    "Filter by specialty to find specialists", 
                    "Filter by hospital to find doctors at specific hospitals"
                ]
            },
            "patient_table": {
                "primary_key": "id",
                "foreign_keys": {
                    "primary_physician": "may reference doctor_table.id"
                },
                "referenced_by": ["clinical_notes.patient_id (if exists)"],
                "description": "Patient demographic and medical information",
                "common_queries": [
                    "Search by first_name or last_name to find patients",
                    "Search by id_number for exact patient lookup",
                    "Search allergies or med_conditions for medical history",
                    "Filter by primary_physician to find patients of a specific doctor"
                ]
            }
        }
        
        return json.dumps({
            "success": True,
            "relationships": relationships,
            "notes": [
                "Use first_name or last_name to search for people",
                "doctor_table contains all doctor information",
                "patient_table contains all patient information", 
                "primary_physician in patient_table may link to doctor_table.id"
            ]
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

# Update the search_database tool to handle the correct table names
@mcp.tool()
def search_database(table_name: str, column: str, search_term: str, limit: int = 5) -> str:
    """
    Search any table in the Supabase database.
    
    Args:
        table_name: Name of the table to search (doctor_table, patient_table)
        column: Column name to search in
        search_term: Term to search for
        limit: Maximum number of results (default 5)
        
    Returns:
        JSON string containing search results
    """
    try:
        # Validate table name
        valid_tables = ["doctor_table", "patient_table", "clinical_notes"]
        if table_name not in valid_tables:
            return json.dumps({
                "success": False,
                "error": f"Invalid table name. Valid tables: {valid_tables}"
            })
        
        query = supabase.table(table_name).select('*')
        query = query.ilike(column, f'%{search_term}%')
        result = query.limit(limit).execute()
        
        return json.dumps({
            "success": True,
            "table": table_name,
            "search_column": column,
            "search_term": search_term,
            "count": len(result.data),
            "data": result.data
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@mcp.tool()
def get_common_queries() -> str:
    """
    Get examples of common queries that can be performed on the database.
    
    Returns:
        JSON string containing query examples and patterns
    """
    try:
        query_examples = {
            "patient_queries": [
                "Find all clinical notes for a specific patient",
                "Get patient demographics and contact info",
                "Search patients by name or medical record number"
            ],
            "doctor_queries": [
                "Get all notes created by a specific doctor",
                "Find doctor information and credentials",
                "List all doctors in the system"
            ],
            "clinical_note_queries": [
                "Search notes by patient name or condition",
                "Filter notes by date range",
                "Find notes containing specific medical terms",
                "Get recent consultations"
            ],
            "example_filters": {
                "by_doctor": '{"doctor_id": "123"}',
                "by_patient": '{"patient_name": "John Doe"}',
                "by_date": '{"created_at": "2025-01-01"}',
                "by_condition": 'Use search_database with chief_complaint or assessment columns'
            }
        }
        
        return json.dumps({
            "success": True,
            "query_examples": query_examples,
            "recommended_approach": [
                "1. Use get_database_context() first to understand available tables",
                "2. Use get_table_schema() for specific table details",
                "3. Use search_database() for text-based searches",
                "4. Use execute_custom_query() for complex filtered queries"
            ]
        }, indent=2)
        
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

# Update the existing get_table_schema function to be more detailed
@mcp.tool()
def get_table_schema(table_name: str) -> str:
    """
    Get detailed schema/structure of a specific table.
    
    Args:
        table_name: Name of the table
        
    Returns:
        JSON string containing detailed table schema information
    """
    try:
        # Get sample data to understand structure
        result = supabase.table(table_name).select('*').limit(3).execute()
        
        if result.data:
            # Analyze multiple rows for better type detection
            all_columns = set()
            for row in result.data:
                all_columns.update(row.keys())
            
            column_analysis = {}
            for col in all_columns:
                values = [row.get(col) for row in result.data if row.get(col) is not None]
                if values:
                    value_types = [type(v).__name__ for v in values]
                    most_common_type = max(set(value_types), key=value_types.count)
                    
                    column_analysis[col] = {
                        "type": most_common_type,
                        "sample_values": [str(v)[:30] + "..." if len(str(v)) > 30 else str(v) for v in values[:2]],
                        "null_count": len([row for row in result.data if row.get(col) is None])
                    }
                else:
                    column_analysis[col] = {
                        "type": "unknown",
                        "sample_values": [],
                        "null_count": len(result.data)
                    }
            
            schema = {
                "table_name": table_name,
                "total_columns": len(all_columns),
                "columns": sorted(list(all_columns)),
                "column_details": column_analysis,
                "sample_row_count": len(result.data),
                "sample_data": result.data[0] if result.data else None
            }
            
            return json.dumps({"success": True, "schema": schema}, indent=2)
        else:
            return json.dumps({"success": True, "message": f"Table '{table_name}' is empty or doesn't exist"})
            
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

# execute and return the stdio output
if __name__ == "__main__":
    print("Starting MCP server...")
    print(f"Supabase URL: {url}")
    run_server(transport="streamable-http", host="localhost", port=8008)