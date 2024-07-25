terraform {
  required_providers {
    astra = {
      source  = "datastax/astra"
      version = "2.3.6"
    }
  }
}

provider "astra" {}

resource "astra_database" "inventory_db" {
  name                = "inventory_db"
  keyspace            = "inventory_keyspace"
  cloud_provider      = "aws"
  regions             = ["eu-west-1"]
  deletion_protection = false
}

resource "astra_table" "products" {
  keyspace           = astra_database.inventory_db.keyspace
  database_id        = astra_database.inventory_db.id
  region             = astra_database.inventory_db.regions[0]
  table              = "products"
  partition_keys     = "product_id"
  clustering_columns = "product_category:product_name"
  column_definitions = [
    {
      Name : "product_id"
      Static : false
      TypeDefinition : "uuid"
    },
    {
      Name : "product_category"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_name"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "cost_price"
      Static : false
      TypeDefinition : "decimal"
    },
    {
      Name : "quantity_in_stock"
      Static : false
      TypeDefinition : "bigint"
    },
    {
      Name : "warehouse_id"
      Static : false
      TypeDefinition : "uuid"
    },
    {
      Name : "warehouse_location"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "delivery_date"
      Static : false
      TypeDefinition : "date"
    },
  ]
}

resource "astra_table" "products_by_category" {
  keyspace           = astra_database.inventory_db.keyspace
  database_id        = astra_database.inventory_db.id
  region             = astra_database.inventory_db.regions[0]
  table              = "products_by_category"
  partition_keys     = "product_category"
  clustering_columns = "product_name"
  column_definitions = [
    {
      Name : "product_id"
      Static : false
      TypeDefinition : "uuid"
    },
    {
      Name : "product_category"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_name"
      Static : false
      TypeDefinition : "text"
    }
  ]
}

resource "astra_table" "products_by_warehouse" {
  keyspace           = astra_database.inventory_db.keyspace
  database_id        = astra_database.inventory_db.id
  region             = astra_database.inventory_db.regions[0]
  table              = "products_by_warehouse"
  partition_keys     = "warehouse_name"
  clustering_columns = "product_name:warehouse_id"
  column_definitions = [
    {
      Name : "warehouse_name"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_name"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "warehouse_id"
      Static : false
      TypeDefinition : "uuid"
    },
    {
      Name : "warehouse_location"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_id"
      Static : false
      TypeDefinition : "uuid"
    }
  ]
}

resource "astra_table" "stocks_by_quantity" {
  keyspace           = astra_database.inventory_db.keyspace
  database_id        = astra_database.inventory_db.id
  region             = astra_database.inventory_db.regions[0]
  table              = "stocks_by_quantity"
  partition_keys     = "product_category"
  clustering_columns = "product_name"
  column_definitions = [
    {
      Name : "product_category"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_name"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_id"
      Static : false
      TypeDefinition : "uuid"
    },
    {
      Name : "quantity_in_stock"
      Static : false
      TypeDefinition : "bigint"
    },
  ]
}

resource "astra_table" "transactions_by_date" {
  keyspace           = astra_database.inventory_db.keyspace
  database_id        = astra_database.inventory_db.id
  region             = astra_database.inventory_db.regions[0]
  table              = "transactions_by_date"
  partition_keys     = "transaction_date"
  clustering_columns = "product_name:transaction_id"
  column_definitions = [
    {
      Name : "transaction_date"
      Static : false
      TypeDefinition : "date"
    },
    {
      Name : "transaction_id"
      Static : false
      TypeDefinition : "uuid"
    },
    {
      Name : "product_name"
      Static : false
      TypeDefinition : "text"
    },
    {
      Name : "product_id"
      Static : false
      TypeDefinition : "uuid"
    }

  {
      Name : "total_cost"
      Static : false
      TypeDefinition : "decimal"
    }
  ]
}