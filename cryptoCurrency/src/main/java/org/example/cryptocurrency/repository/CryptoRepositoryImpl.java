package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.repository.contracts.CryptoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CryptoRepositoryImpl implements CryptoRepository {

    private final DataSource dataSource;

    @Autowired
    public CryptoRepositoryImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Crypto findById(Integer id) {
        String sql = "SELECT id, symbol, name, current_price FROM crypto WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setInt(1, id);
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if (resultSet.next()) {
                    return mapRowToCrypto(resultSet);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Crypto> findAll() {
        List<Crypto> list = new ArrayList<>();
        String sql = "SELECT id, symbol, name, current_price FROM crypto";
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                list.add(mapRowToCrypto(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public Crypto findBySymbol(String symbol) {
        String sql = "SELECT id, symbol, name, current_price FROM crypto WHERE symbol = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, symbol);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                if (rs.next()) {
                    return mapRowToCrypto(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Crypto save(Crypto crypto) {
        if (crypto.getId() == null) {
            String insertSql = "INSERT INTO crypto (symbol, name, current_price) VALUES (?, ?, ?)";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {

                ps.setString(1, crypto.getSymbol());
                ps.setString(2, crypto.getName());
                ps.setBigDecimal(3, crypto.getCurrentPrice() != null ? crypto.getCurrentPrice() : BigDecimal.ZERO);
                ps.executeUpdate();

                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        crypto.setId(keys.getInt(1));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            // UPDATE
            String updateSql = "UPDATE crypto SET symbol=?, name=?, current_price=? WHERE id=?";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {

                ps.setString(1, crypto.getSymbol());
                ps.setString(2, crypto.getName());
                ps.setBigDecimal(3, crypto.getCurrentPrice());
                ps.setInt(4, crypto.getId());
                ps.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return crypto;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM crypto WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Crypto mapRowToCrypto(ResultSet rs) throws SQLException {
        Crypto c = new Crypto();
        c.setId(rs.getInt("id"));
        c.setSymbol(rs.getString("symbol"));
        c.setName(rs.getString("name"));
        c.setCurrentPrice(rs.getBigDecimal("current_price"));
        return c;
    }
}
