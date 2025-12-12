class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string  :title, null: false
      t.text    :description
      t.integer :stage, null: false, default: 0
      t.string  :tags, array: true, default: []

      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
