package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.models.UserHoldings;
import org.example.cryptocurrency.repository.contracts.UserHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserHoldingRepositoryImpl implements UserHoldingRepository {

    private final DataSource dataSource;

    @Autowired
    public UserHoldingRepositoryImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public UserHoldings findById(Integer id) {
        String sql = "SELECT id, user_id, crypto_id, quantity FROM user_holdings WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRowToUserHoldings(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<UserHoldings> findAll() {
        List<UserHoldings> list = new ArrayList<>();
        String sql = "SELECT id, user_id, crypto_id, quantity FROM user_holdings";
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRowToUserHoldings(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<UserHoldings> findByUserId(Integer userId) {
        List<UserHoldings> list = new ArrayList<>();
        String sql = "SELECT uh.id AS holding_id, uh.user_id, uh.crypto_id, uh.quantity, " +
                "       c.name AS name, c.symbol AS crypto_symbol, c.current_price " +
                "FROM user_holdings uh " +
                "JOIN crypto c ON uh.crypto_id = c.id " +
                "WHERE uh.user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToUserHoldings(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public UserHoldings findByUserIdAndCryptoId(Integer userId, Integer cryptoId) {
        String sql = "SELECT uh.id AS holding_id, uh.user_id, uh.crypto_id, uh.quantity, " +
                "       c.name AS name, c.symbol AS crypto_symbol, c.current_price " +
                "FROM user_holdings uh " +
                "JOIN crypto c ON uh.crypto_id = c.id " +
                "WHERE uh.user_id = ? AND uh.crypto_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, cryptoId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRowToUserHoldings(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public UserHoldings save(UserHoldings holding) {
        if (holding.getId() == null) {
            String insertSql = "INSERT INTO user_holdings (user_id, crypto_id, quantity) VALUES (?, ?, ?)";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setInt(1, holding.getUser().getUserId());
                ps.setInt(2, holding.getCrypto().getId());
                ps.setBigDecimal(3, holding.getQuantity() != null ? holding.getQuantity() : BigDecimal.ZERO);
                ps.executeUpdate();

                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        holding.setId(keys.getInt(1));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            // UPDATE
            String updateSql = "UPDATE user_holdings SET quantity=? WHERE id=?";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setBigDecimal(1, holding.getQuantity());
                ps.setInt(2, holding.getId());
                ps.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return holding;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM user_holdings WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private UserHoldings mapRowToUserHoldings(ResultSet rs) throws SQLException {
        UserHoldings uh = new UserHoldings();
        uh.setId(rs.getInt("holding_id")); // using the alias
        UserAccount ua = new UserAccount();
        ua.setUserId(rs.getInt("user_id"));
        uh.setUser(ua);

        Crypto c = new Crypto();
        c.setId(rs.getInt("crypto_id"));
        c.setName(rs.getString("name"));              // now "name" exists
        c.setSymbol(rs.getString("crypto_symbol"));     // note: symbol is aliased as crypto_symbol
        c.setCurrentPrice(rs.getBigDecimal("current_price"));
        uh.setCrypto(c);
        uh.setQuantity(rs.getBigDecimal("quantity"));
        return uh;
    }
}