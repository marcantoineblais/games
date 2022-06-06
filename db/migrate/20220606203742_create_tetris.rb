class CreateTetris < ActiveRecord::Migration[6.1]
  def change
    create_table :tetris do |t|

      t.timestamps
    end
  end
end
