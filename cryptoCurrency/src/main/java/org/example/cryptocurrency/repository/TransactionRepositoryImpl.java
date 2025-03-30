package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.repository.contracts.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TransactionRepositoryImpl implements TransactionRepository {

    private final DataSource dataSource;

    @Autowired
    public TransactionRepositoryImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Transaction findById(Integer transactionId) {
        String sql = "SELECT transaction_id, user_id, crypto_id, quantity, transaction_price, transaction_type, transaction_time "
                + "FROM transaction WHERE transaction_id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, transactionId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRowToTransaction(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Transaction> findByCryptoId(Integer cryptoId) {
        List<Transaction> list = new ArrayList<>();
        String sql = "SELECT transaction_id, user_id, crypto_id, quantity, transaction_price, transaction_type, transaction_time "
                + "FROM transaction WHERE crypto_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, cryptoId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToTransaction(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<Transaction> findAll() {
        List<Transaction> list = new ArrayList<>();
        String sql = "SELECT transaction_id, user_id, crypto_id, quantity, transaction_price, transaction_type, transaction_time FROM transaction";
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRowToTransaction(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<Transaction> findByUserIdOrderByTransactionTimeDesc(Integer userId) {
        List<Transaction> list = new ArrayList<>();
        String sql = "SELECT t.transaction_id,\n" +
                "       t.user_id,\n" +
                "       t.quantity,\n" +
                "       t.transaction_price,\n" +
                "       t.transaction_type,\n" +
                "       t.transaction_time,\n" +
                "       c.id AS crypto_id,\n" +
                "       c.symbol,\n" +
                "       c.name,\n" +
                "       c.current_price\n" +
                "FROM transaction t\n" +
                "JOIN crypto c ON t.crypto_id = c.id\n" +
                "WHERE t.user_id = ?\n" +
                "ORDER BY t.transaction_time DESC";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToTransaction(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public Transaction save(Transaction tx) {
        if (tx.getTransactionId() == null) {
            String insertSql = "INSERT INTO transaction (user_id, crypto_id, quantity, transaction_price, transaction_type) "
                    + "VALUES (?, ?, ?, ?, ?)";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setInt(1, tx.getUser().getUserId());
                ps.setInt(2, tx.getCrypto().getId());
                ps.setBigDecimal(3, tx.getQuantity());
                ps.setBigDecimal(4, tx.getTransactionPrice());
                ps.setString(5, tx.getTransactionType());
                ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        tx.setTransactionId(keys.getInt(1));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            String updateSql = "UPDATE transaction SET user_id=?, crypto_id=?, quantity=?, transaction_price=?, transaction_type=? "
                    + "WHERE transaction_id=?";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setInt(1, tx.getUser().getUserId());
                ps.setInt(2, tx.getCrypto().getId());
                ps.setBigDecimal(3, tx.getQuantity());
                ps.setBigDecimal(4, tx.getTransactionPrice());
                ps.setString(5, tx.getTransactionType());
                ps.setInt(6, tx.getTransactionId());

                ps.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return tx;
    }
    @Override
    public void delete(Integer transactionId) {
        String sql = "DELETE FROM transaction WHERE transaction_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, transactionId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Transaction mapRowToTransaction(ResultSet rs) throws SQLException {
        Transaction t = new Transaction();
        t.setTransactionId(rs.getInt("transaction_id"));

        UserAccount ua = new UserAccount();
        ua.setUserId(rs.getInt("user_id"));
        t.setUser(ua);

        Crypto c = new Crypto();
        c.setId(rs.getInt("crypto_id"));
        c.setSymbol(rs.getString("symbol"));          // now populated
        c.setName(rs.getString("name"));              // now populated
        c.setCurrentPrice(rs.getBigDecimal("current_price")); // now populated
        t.setCrypto(c);

        t.setQuantity(rs.getBigDecimal("quantity"));
        t.setTransactionPrice(rs.getBigDecimal("transaction_price"));
        t.setTransactionType(rs.getString("transaction_type"));

        Timestamp ts = rs.getTimestamp("transaction_time");
        if (ts != null) {
            t.setTransactionTime(ts.toLocalDateTime());
        }
        return t;
    }

}
